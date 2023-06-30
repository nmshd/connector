import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { MongoDbConnection } from "@js-soft/docdb-access-mongo";
import { ILogger } from "@js-soft/logging-abstractions";
import { NodeLoggerFactory } from "@js-soft/node-logger";
import { ApplicationError } from "@js-soft/ts-utils";
import { ConsumptionController } from "@nmshd/consumption";
import { ConsumptionServices, DataViewExpander, GetIdentityInfoResponse, ModuleConfiguration, Runtime, RuntimeHealth, RuntimeServices, TransportServices } from "@nmshd/runtime";
import { AccountController, CoreErrors as TransportCoreErrors } from "@nmshd/transport";
import axios from "axios";
import fs from "fs";
import { validate as validateSchema } from "jsonschema";
import path from "path";
import { ConnectorMode } from "./ConnectorMode";
import { ConnectorRuntimeConfig } from "./ConnectorRuntimeConfig";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "./ConnectorRuntimeModule";
import { DocumentationLink } from "./DocumentationLink";
import { HealthChecker } from "./HealthChecker";
import { buildInformation } from "./buildInformation";
import { HttpServer } from "./infrastructure";
import { ConnectorInfrastructureRegistry } from "./infrastructure/ConnectorInfrastructureRegistry";
import { ConnectorLoggerFactory } from "./logging/ConnectorLoggerFactory";

interface SupportInformation {
    health: RuntimeHealth;
    configuration: any;
    version: { version: string; build: string; date: string; commit: string };
    identityInfo: GetIdentityInfoResponse | { error: string };
}

export class ConnectorRuntime extends Runtime<ConnectorRuntimeConfig> {
    private static readonly MODULES_DIRECTORY = path.join(__dirname, "modules");

    private mongodbConnection?: MongoDbConnection;
    private accountController: AccountController;

    private _transportServices: TransportServices;
    public get transportServices(): TransportServices {
        return this._transportServices;
    }

    private _consumptionServices: ConsumptionServices;
    public get consumptionServices(): ConsumptionServices {
        return this._consumptionServices;
    }

    private get connectorMode(): ConnectorMode {
        return this.runtimeConfig.debug ? "debug" : "production";
    }

    private _dataViewExpander: DataViewExpander;

    public override getServices(): RuntimeServices {
        return {
            transportServices: this._transportServices,
            consumptionServices: this._consumptionServices,
            dataViewExpander: this._dataViewExpander
        };
    }

    public readonly infrastructure = new ConnectorInfrastructureRegistry();

    private healthChecker: HealthChecker;

    private constructor(connectorConfig: ConnectorRuntimeConfig, loggerFactory: NodeLoggerFactory) {
        super(connectorConfig, loggerFactory);
    }

    public static async create(connectorConfig: ConnectorRuntimeConfig): Promise<ConnectorRuntime> {
        const schemaPath = path.join(__dirname, "jsonSchemas", "connectorConfig.json");
        const runtimeConfigSchemaString = fs.readFileSync(schemaPath).toString();
        const runtimeConfigSchema = JSON.parse(runtimeConfigSchemaString);
        const result = validateSchema(connectorConfig, runtimeConfigSchema);
        if (!result.valid) {
            let errorMessage = "The configuration is not valid:";
            for (const error of result.errors) {
                errorMessage += `\r\n  - ${error.stack}`;
            }
            console.error(errorMessage); // eslint-disable-line no-console
            throw new Error(errorMessage);
        }

        this.forceEnableMandatoryModules(connectorConfig);

        const loggerFactory = new NodeLoggerFactory(connectorConfig.logging);
        ConnectorLoggerFactory.init(loggerFactory);

        const runtime = new ConnectorRuntime(connectorConfig, loggerFactory);
        await runtime.init();

        runtime.scheduleKillTask();
        runtime.setupGlobalExceptionHandling();

        return runtime;
    }

    private static forceEnableMandatoryModules(connectorConfig: ConnectorRuntimeConfig) {
        connectorConfig.modules.decider.enabled = true;
        connectorConfig.modules.request.enabled = true;
        connectorConfig.modules.attributeListener.enabled = true;
    }

    protected async createDatabaseConnection(): Promise<IDatabaseConnection> {
        if (!this.runtimeConfig.database.connectionString) {
            this.logger.error(`No database connection string provided. See ${DocumentationLink.integrate__configuration("database")} on how to configure the database connection.`);
            process.exit(1);
        }

        if (this.mongodbConnection) {
            throw new Error("The database connection was already created.");
        }

        this.mongodbConnection = new MongoDbConnection(this.runtimeConfig.database.connectionString);

        try {
            await this.mongodbConnection.connect();
        } catch (e) {
            this.logger.error("Could not connect to the configured database. Try to check the connection string and the database status. Root error: ", e);

            process.exit(1);
        }
        this.logger.debug("Finished initialization of Mongo DB connection.");

        return this.mongodbConnection;
    }

    protected async initAccount(): Promise<void> {
        const db = await this.transport.createDatabase(`acc-${this.runtimeConfig.database.dbName}`);

        this.accountController = await new AccountController(this.transport, db, this.transport.config).init().catch((e) => {
            if (e instanceof ApplicationError && e.code === "error.transport.general.platformClientInvalid") {
                this.logger.error(TransportCoreErrors.general.platformClientInvalid().message);
                process.exit(1);
            }

            throw e;
        });
        const consumptionController = await new ConsumptionController(this.transport, this.accountController).init();

        await this.checkDeviceCredentials(this.accountController);

        ({
            transportServices: this._transportServices,
            consumptionServices: this._consumptionServices,
            dataViewExpander: this._dataViewExpander
        } = await this.login(this.accountController, consumptionController));

        this.healthChecker = HealthChecker.create(
            new MongoDbConnection(this.runtimeConfig.database.connectionString, {
                connectTimeoutMS: 1000,
                socketTimeoutMS: 1000,
                maxIdleTimeMS: 1000,
                waitQueueTimeoutMS: 1000,
                serverSelectionTimeoutMS: 1000
            }),
            axios.create({ baseURL: this.transport.config.baseUrl }),
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
        config.database.connectionString = "***";

        const httpServer = config.infrastructure.httpServer as any;
        if (httpServer?.apiKey) {
            httpServer.apiKey = "***";
        }

        const transport = config.transportLibrary;
        if (transport.platformClientSecret) {
            transport.platformClientSecret = "***";
        }

        return config;
    }

    public async getSupportInformation(): Promise<SupportInformation> {
        const supportInformation = await super.getSupportInformation();

        const identityInfoResult = await this.transportServices.account.getIdentityInfo();
        const identityInfo = identityInfoResult.isSuccess ? identityInfoResult.value : { error: identityInfoResult.error.message };

        return {
            version: buildInformation,
            health: supportInformation.health,
            configuration: this.sanitizeConfig(supportInformation.configuration),
            identityInfo
        };
    }

    protected async loadModule(moduleConfiguration: ModuleConfiguration): Promise<void> {
        const connectorModuleConfiguration = moduleConfiguration as ConnectorRuntimeModuleConfiguration;

        for (const requiredInfrastructure of connectorModuleConfiguration.requiredInfrastructure ?? []) {
            const infrastructureConfiguration = (this.runtimeConfig.infrastructure as any)[requiredInfrastructure];
            if (!infrastructureConfiguration?.enabled) {
                this.logger.error(
                    `Module '${this.getModuleName(connectorModuleConfiguration)}' requires the '${requiredInfrastructure}' infrastructure, but it is not available / enabled.`
                );
                process.exit(1);
            }
        }

        const modulePath = path.join(ConnectorRuntime.MODULES_DIRECTORY, moduleConfiguration.location);
        const nodeModule = await this.import(modulePath);

        if (!nodeModule) {
            this.logger.error(
                `Module '${this.getModuleName(moduleConfiguration)}' could not be loaded: the location of the module (${moduleConfiguration.location}) does not exist.`
            );
            return;
        }

        const moduleConstructor = nodeModule.default as
            | (new (runtime: ConnectorRuntime, configuration: ConnectorRuntimeModuleConfiguration, logger: ILogger, connectorMode: ConnectorMode) => ConnectorRuntimeModule)
            | undefined;

        if (!moduleConstructor) {
            this.logger.error(
                `Module '${this.getModuleName(
                    moduleConfiguration
                )}' could not be loaded: the constructor could not be found. Remember to use the default export ('export default class MyModule...').`
            );
            return;
        }

        const module = new moduleConstructor(this, connectorModuleConfiguration, this.loggerFactory.getLogger(moduleConstructor), this.connectorMode);

        this.modules.add(module);

        this.logger.info(`Module '${this.getModuleName(moduleConfiguration)}' was loaded successfully.`);
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

    protected async initInfrastructure(): Promise<void> {
        if (this.runtimeConfig.infrastructure.httpServer.enabled) {
            const httpServer = new HttpServer(this, this.runtimeConfig.infrastructure.httpServer, this.loggerFactory.getLogger(HttpServer), "httpServer", this.connectorMode);
            this.infrastructure.add(httpServer);
        }

        for (const infrastructure of this.infrastructure) {
            await infrastructure.init();
        }
    }

    protected async startInfrastructure(): Promise<void> {
        for (const infrastructure of this.infrastructure) {
            await infrastructure.start();
        }
    }

    protected async stop(): Promise<void> {
        try {
            await super.stop();
        } catch (e) {
            this.logger.error(e);
        }

        try {
            await this.mongodbConnection?.close();
        } catch (e) {
            this.logger.error(e);
        }

        // This must be the last operation as some stop tasks use the logger
        (this.loggerFactory as NodeLoggerFactory).close();
    }

    protected async stopInfrastructure(): Promise<void> {
        for (const infrastructure of this.infrastructure) {
            await infrastructure.stop();
        }
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
