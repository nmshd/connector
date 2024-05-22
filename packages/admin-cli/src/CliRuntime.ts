import { NodeLoggerFactory } from "@js-soft/node-logger";
import { ApplicationError } from "@js-soft/ts-utils";
import { ConnectorLoggerFactory, ConnectorRuntime, ConnectorRuntimeConfig } from "@nmshd/connector";
import { RuntimeModuleRegistry } from "@nmshd/runtime";
import { AccountController, CoreErrors } from "@nmshd/transport";
import { HttpsProxyAgent } from "https-proxy-agent";

class CLIRuntimeModuleRegistry extends RuntimeModuleRegistry {
    public add(): void {
        //Ignore
    }
}

export class CliRuntime extends ConnectorRuntime {
    public static async create(connectorConfig: ConnectorRuntimeConfig): Promise<CliRuntime> {
        ConnectorRuntime.validateConfig(connectorConfig);

        const loggerFactory = new NodeLoggerFactory(connectorConfig.logging);
        ConnectorLoggerFactory.init(loggerFactory);

        if (process.env.https_proxy) {
            const httpsProxy = process.env.https_proxy;
            connectorConfig.transportLibrary.httpsAgent = new HttpsProxyAgent(httpsProxy);
        }

        const runtime = new CliRuntime(connectorConfig, loggerFactory);
        await runtime.init();

        return runtime;
    }
    public get modules(): RuntimeModuleRegistry {
        return new CLIRuntimeModuleRegistry();
    }

    public async createIdentity() {
        const db = await this.transport.createDatabase(`${this.runtimeConfig.database.dbNamePrefix}${this.runtimeConfig.database.dbName}`);

        const accountController = await new AccountController(this.transport, db, this.transport.config);
        accountController.init().catch((e) => {
            if (e instanceof ApplicationError && e.code === "error.transport.general.platformClientInvalid") {
                this.logger.error(CoreErrors.general.platformClientInvalid().message);
                process.exit(1);
            }

            throw e;
        });

        await db.close();
    }

    protected override async loadModule() {
        //Do Nothing here
    }

    protected override async startInfrastructure() {
        //Do Nothing here
    }
    protected override async stopInfrastructure() {
        //Do Nothing here
    }
    public override async stop() {
        super.stop();
    }
}
