import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { LokiJsConnection } from "@js-soft/docdb-access-loki";
import { MongoDbConnection } from "@js-soft/docdb-access-mongo";
import { ILogger } from "@js-soft/logging-abstractions";
import { NodeLoggerFactory } from "@js-soft/node-logger";
import { ApplicationError } from "@js-soft/ts-utils";
import { AbstractConnectorRuntime, ConnectorMode, ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration, DocumentationLink } from "@nmshd/connector-types";
import { ConsumptionController } from "@nmshd/consumption";
import { ConsumptionServices, DataViewExpander, GetIdentityInfoResponse, ModuleConfiguration, RuntimeHealth, RuntimeServices, TransportServices } from "@nmshd/runtime";
import { AccountController, TransportCoreErrors } from "@nmshd/transport";
import axios from "axios";
import correlator from "correlation-id";
import { HttpsProxyAgent } from "https-proxy-agent";
import { checkServerIdentity, PeerCertificate } from "tls";
import { ConnectorRuntimeConfig } from "./ConnectorRuntimeConfig";
import { HealthChecker } from "./HealthChecker";
import { buildInformation } from "./buildInformation";
import { ConnectorInfrastructureRegistry, HttpServer } from "./infrastructure";
import {
    AutoAcceptPendingRelationshipsModule,
    AutoDecomposeDeletionProposedRelationshipsModule,
    CoreHttpApiModule,
    MessageBrokerPublisherModule,
    SseModule,
    SyncModule,
    WebhooksModule
} from "./modules";

interface SupportInformation {
    health: RuntimeHealth;
    configuration: any;
    version: { version: string; build: string; date: string; commit: string };
    identityInfo: GetIdentityInfoResponse | { error: string };
}

export class ConnectorRuntime extends AbstractConnectorRuntime<ConnectorRuntimeConfig> {
    private accountController: AccountController;

    private _transportServices: TransportServices;
    private _consumptionServices: ConsumptionServices;

    private get connectorMode(): ConnectorMode {
        return this.runtimeConfig.debug ? "debug" : "production";
    }

    private _dataViewExpander: DataViewExpander;

    public getServices(): RuntimeServices {
        return { transportServices: this._transportServices, consumptionServices: this._consumptionServices, dataViewExpander: this._dataViewExpander };
    }

    public readonly infrastructure = new ConnectorInfrastructureRegistry();

    private healthChecker: HealthChecker;

    private constructor(connectorConfig: ConnectorRuntimeConfig, loggerFactory: NodeLoggerFactory) {
        super(connectorConfig, loggerFactory, undefined, correlator);
    }

    public static async create(connectorConfig: ConnectorRuntimeConfig): Promise<ConnectorRuntime> {
        const loggerFactory = new NodeLoggerFactory(connectorConfig.logging);

        this.setServerIdentityCheckFromKeyPinning(connectorConfig, loggerFactory.getLogger(ConnectorRuntime));
        this.forceEnableMandatoryModules(connectorConfig);

        const runtime = new ConnectorRuntime(connectorConfig, loggerFactory);
        await runtime.init();

        await this.runBackboneCompatibilityCheck(runtime);

        runtime.scheduleKillTask();
        runtime.setupGlobalExceptionHandling();

        return runtime;
    }

    private static setServerIdentityCheckFromKeyPinning(connectorConfig: ConnectorRuntimeConfig, logger: ILogger) {
        if (!connectorConfig.pinnedTLSCertificateSHA256Fingerprints) return;
        const pinnedFingerprints = connectorConfig.pinnedTLSCertificateSHA256Fingerprints;

        for (const host in pinnedFingerprints) {
            if (!host.match(/^((([A-Za-z0-9]+(-[A-Za-z0-9]+)*)\.)+[a-z]{2,}|localhost)$/)) {
                throw new Error(`Invalid host '${host}' in pinnedTLSCertificateSHA256Fingerprints. The host must not contain a protocol, path or query.`);
            }

            logger.info(`Certificate pinning is enforced for host '${host}' with fingerprint(s) '${pinnedFingerprints[host].join(", ")}'.`);
        }

        connectorConfig.transportLibrary.httpsAgentOptions = {
            ...connectorConfig.transportLibrary.httpsAgentOptions,
            checkServerIdentity: (host: string, certificate: PeerCertificate) => {
                const error = checkServerIdentity(host, certificate);
                if (error) return error;

                if (connectorConfig.enforceCertificatePinning && !(host in pinnedFingerprints)) {
                    return new Error(
                        `Certificate verification error: Certificate pinning is enforced, but no pinned certificate fingerprint is provided in the configuration for the requested host '${host}'.`
                    );
                }

                if (!(host in pinnedFingerprints)) return;
                const pinnedFingerprintsForHost = pinnedFingerprints[host];

                const fingerprint = certificate.fingerprint256.replaceAll(":", "").toLocaleLowerCase();
                if (pinnedFingerprintsForHost.find((e) => e.replaceAll(":", "").toLocaleLowerCase() === fingerprint)) return;

                return new Error(
                    `Certificate verification error: The SHA256 fingerprint of the received certificate '${fingerprint}' doesn't match a pinned certificate fingerprint for host '${host}'.`
                );
            }
        };
    }

    private static forceEnableMandatoryModules(connectorConfig: ConnectorRuntimeConfig) {
        connectorConfig.modules.decider.enabled = true;
        connectorConfig.modules.request.enabled = true;
        connectorConfig.modules.attributeListener.enabled = true;
    }

    private static async runBackboneCompatibilityCheck(runtime: ConnectorRuntime) {
        const compatibilityResult = await runtime.anonymousServices.backboneCompatibility.checkBackboneCompatibility();
        if (compatibilityResult.isError) throw compatibilityResult.error;

        if (compatibilityResult.value.isCompatible) return;

        throw new Error(
            `The given Backbone is not compatible with this Connector version. The version of the configured Backbone is '${compatibilityResult.value.backboneVersion}' the supported min/max version is '${compatibilityResult.value.supportedMinBackboneVersion}/${compatibilityResult.value.supportedMaxBackboneVersion}'.`
        );
    }

    protected async createDatabaseConnection(): Promise<IDatabaseConnection> {
        if (this.runtimeConfig.database.driver === "lokijs") {
            if (!this.runtimeConfig.debug) throw new Error("LokiJS is only available in debug mode.");

            const folder = this.runtimeConfig.database.folder;
            if (!folder) throw new Error("No folder provided for LokiJS database.");

            return new LokiJsConnection(folder, undefined, { autoload: true, autosave: true, persistenceMethod: "fs" });
        }

        if (!this.runtimeConfig.database.connectionString) {
            this.logger.error(`No database connection string provided. See ${DocumentationLink.operate__configuration("database")} on how to configure the database connection.`);
            process.exit(1);
        }

        const mongodbConnection = new MongoDbConnection(this.runtimeConfig.database.connectionString);

        try {
            await mongodbConnection.connect();
        } catch (e) {
            this.logger.error("Could not connect to the configured database. Try to check the connection string and the database status. Root error: ", e);

            process.exit(1);
        }

        this.logger.debug("Finished initialization of Mongo DB connection.");

        return mongodbConnection;
    }

    protected async initAccount(): Promise<void> {
        const db = await this.databaseConnection.getDatabase(`${this.runtimeConfig.database.dbNamePrefix}${this.runtimeConfig.database.dbName}`);

        this.accountController = await new AccountController(this.transport, db, this.transport.config).init().catch((e) => {
            if (e instanceof ApplicationError && e.code === "error.transport.general.platformClientInvalid") {
                this.logger.error(TransportCoreErrors.general.platformClientInvalid().message);
                process.exit(1);
            }

            throw e;
        });

        const consumptionController = await new ConsumptionController(this.transport, this.accountController, { setDefaultRepositoryAttributes: false }).init();

        await this.checkDeviceCredentials(this.accountController);

        ({
            transportServices: this._transportServices,
            consumptionServices: this._consumptionServices,
            dataViewExpander: this._dataViewExpander
        } = await this.login(this.accountController, consumptionController));

        const httpsProxy = process.env.https_proxy ?? process.env.HTTPS_PROXY;
        this.healthChecker = HealthChecker.create(
            this.runtimeConfig.database.driver === "lokijs"
                ? undefined
                : new MongoDbConnection(this.runtimeConfig.database.connectionString, {
                      connectTimeoutMS: 1000,
                      socketTimeoutMS: 1000,
                      maxIdleTimeMS: 1000,
                      waitQueueTimeoutMS: 1000,
                      serverSelectionTimeoutMS: 1000
                  }),
            axios.create({ baseURL: this.transport.config.baseUrl, proxy: false, httpsAgent: httpsProxy ? new HttpsProxyAgent(httpsProxy) : undefined }),
            this.accountController.authenticator,
            this.loggerFactory.getLogger("HealthChecker")
        );
    }

    private async checkDeviceCredentials(accountController: AccountController) {
        try {
            await accountController.authenticator.getToken();
        } catch (e) {
            if (e instanceof ApplicationError && e.code === "error.transport.request.noAuthGrant") {
                this.logger.error(TransportCoreErrors.general.platformClientInvalid().message);
                process.exit(1);
            }
        }
    }

    public async getHealth(): Promise<RuntimeHealth> {
        const health = await this.healthChecker.getReport();
        return health;
    }

    private sanitizeConfig(config: ConnectorRuntimeConfig) {
        switch (config.database.driver) {
            case "lokijs":
                break;
            case "mongodb":
                config.database.connectionString = "***";
                break;
        }

        const httpServer = config.infrastructure.httpServer as any;
        if (httpServer?.apiKey) {
            httpServer.apiKey = "***";
        }

        if (httpServer?.oidc) {
            httpServer.oidc = "***";
        }

        if (httpServer?.jwtBearer) {
            httpServer.jwtBearer = "***";
        }

        const transport = config.transportLibrary;
        if (transport.platformClientSecret) {
            transport.platformClientSecret = "***";
        }

        return config;
    }

    public override async getSupportInformation(): Promise<SupportInformation> {
        const supportInformation = await super.getSupportInformation();

        const identityInfoResult = await this._transportServices.account.getIdentityInfo();
        const identityInfo = identityInfoResult.isSuccess ? identityInfoResult.value : { error: identityInfoResult.error.message };

        return { version: buildInformation, health: supportInformation.health, configuration: this.sanitizeConfig(supportInformation.configuration), identityInfo };
    }

    public async getBackboneAuthenticationToken(): Promise<string> {
        return await this.accountController.authenticator.getToken();
    }

    protected async loadModule(moduleConfiguration: ModuleConfiguration): Promise<void> {
        const connectorModuleConfiguration = moduleConfiguration as ConnectorRuntimeModuleConfiguration;

        for (const requiredInfrastructure of connectorModuleConfiguration.requiredInfrastructure ?? []) {
            const infrastructureConfiguration = (this.runtimeConfig.infrastructure as any)[requiredInfrastructure];
            if (!infrastructureConfiguration?.enabled) {
                this.logger.error(
                    `The module on location '${connectorModuleConfiguration.location}' requires the '${requiredInfrastructure}' infrastructure, but it is not available / enabled.`
                );
                process.exit(1);
            }
        }

        const moduleConstructor = await this.resolveModule(moduleConfiguration);
        if (!moduleConstructor) return;

        const module = new moduleConstructor(this, connectorModuleConfiguration, this.loggerFactory.getLogger(moduleConstructor), this.connectorMode);

        this.modules.add(module);

        this.logger.info(`The module '${module.displayName}' was loaded successfully.`);
    }

    private async resolveModule(
        configuration: ConnectorRuntimeModuleConfiguration
    ): Promise<(new (runtime: ConnectorRuntime, configuration: any, logger: ILogger, connectorMode: ConnectorMode) => ConnectorRuntimeModule) | undefined> {
        if (configuration.location.startsWith("@nmshd/connector:")) {
            return this.resolveInternalModule(configuration.location);
        }

        const importedModule = await this.import(configuration.location);
        if (!importedModule) {
            this.logger.error(`The module on location '${configuration.location}' could not be loaded: the location of the module does not exist.`);
            return;
        }

        const defaultExport = importedModule?.default;
        if (!defaultExport) {
            this.logger.error(
                `The module on location '${configuration.location}' could not be loaded: the constructor could not be found. Remember to use the default export ('export default class MyModule...').`
            );
            return;
        }

        return defaultExport;
    }

    private resolveInternalModule(
        location: string
    ): (new (runtime: ConnectorRuntime, configuration: any, logger: ILogger, connectorMode: ConnectorMode) => ConnectorRuntimeModule) | undefined {
        const moduleName = location.split(":")[1];

        switch (moduleName) {
            case "AutoAcceptPendingRelationshipsModule":
                return AutoAcceptPendingRelationshipsModule;
            case "AutoDecomposeDeletionProposedRelationshipsModule":
                return AutoDecomposeDeletionProposedRelationshipsModule;
            case "CoreHttpApiModule":
                return CoreHttpApiModule;
            case "WebhooksModule":
                return WebhooksModule;
            case "MessageBrokerPublisherModule":
                return MessageBrokerPublisherModule;
            case "SyncModule":
                return SyncModule;
            case "SseModule":
                return SseModule;
            default:
                this.logger.error(`The internal module on location '${location}' could not be loaded because it is not registered as an internal module.`);
                return undefined;
        }
    }

    private async import(moduleName: string) {
        try {
            const module = await import(moduleName);
            return module;
        } catch (e: any) {
            if (e.code === "MODULE_NOT_FOUND" && e.message.includes(`Cannot find module '${moduleName}'`)) {
                return;
            }

            this.logger.error(e);
            throw e;
        }
    }

    protected override async initInfrastructure(): Promise<void> {
        if (this.runtimeConfig.infrastructure.httpServer.enabled) {
            const httpServer = new HttpServer(this, this.runtimeConfig.infrastructure.httpServer, this.loggerFactory.getLogger(HttpServer), "httpServer", this.connectorMode);
            this.infrastructure.add(httpServer);
        }

        for (const infrastructure of this.infrastructure) {
            await infrastructure.init();
        }

        await super.initInfrastructure();
    }

    protected override async startInfrastructure(): Promise<void> {
        for (const infrastructure of this.infrastructure) {
            await infrastructure.start();
        }

        await super.startInfrastructure();
    }

    public override async stop(): Promise<void> {
        if (this.isStarted) {
            try {
                await super.stop();
            } catch (e) {
                this.logger.error(e);
            }
        } else if (this.connectorMode === "debug") {
            this.logger.warn("It seemed like the Connector Runtime didn't do a proper startup. Closing infrastructure.");

            await this.stopInfrastructure();
        }

        try {
            await this.databaseConnection.close();
        } catch (e) {
            this.logger.error(e);
        }

        // This must be the last operation as some stop tasks use the logger
        (this.loggerFactory as NodeLoggerFactory).close();
    }

    protected override async stopInfrastructure(): Promise<void> {
        for (const infrastructure of this.infrastructure) {
            await infrastructure.stop();
        }

        await super.stopInfrastructure();
    }

    private scheduleKillTask() {
        const signals = ["SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT", "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGTERM"];

        for (const signal of signals) {
            process.on(signal, () => this.stop());
        }
    }

    private setupGlobalExceptionHandling(): void {
        process.on("unhandledRejection", (reason, _p) => {
            this.logger.error("Unhandled rejection occured: ", reason);
        });

        process.on("uncaughtException", (e) => {
            this.logger.error("Uncaught exception occured: ", e);
        });
    }
}
