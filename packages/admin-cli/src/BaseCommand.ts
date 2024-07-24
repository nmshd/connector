import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { LokiJsConnection } from "@js-soft/docdb-access-loki";
import { MongoDbConnection } from "@js-soft/docdb-access-mongo";
import { NodeLoggerFactory } from "@js-soft/node-logger";
import { Command, Flags } from "@oclif/core";
import { CLIRuntime } from "./CLIRuntime";
import { ConnectorRuntimeConfig, createConnectorConfig, DocumentationLink } from "./connector";

export abstract class BaseCommand extends Command {
    public static readonly baseFlags = {
        config: Flags.string({ description: "config file", char: "c", default: "./config.json" })
    };

    private connectorConfig?: ConnectorRuntimeConfig;
    protected cliRuitime?: CLIRuntime;

    public static readonly enableJsonFlag = true;

    public static async createDBConnection(runtimeConfig: ConnectorRuntimeConfig): Promise<IDatabaseConnection> {
        if (runtimeConfig.database.driver === "lokijs") {
            if (!runtimeConfig.debug) throw new Error("LokiJS is only available in debug mode.");

            const folder = runtimeConfig.database.folder;
            if (!folder) throw new Error("No folder provided for LokiJS database.");

            return new LokiJsConnection(folder, undefined, { autoload: true, autosave: true, persistenceMethod: "fs" });
        }

        if (!runtimeConfig.database.connectionString) {
            throw new Error(`No database connection string provided. See ${DocumentationLink.operate__configuration("database")} on how to configure the database connection.`);
        }

        const mongodbConnection = new MongoDbConnection(runtimeConfig.database.connectionString);

        try {
            await mongodbConnection.connect();
        } catch (e) {
            throw new Error(`Could not connect to the configured database. Try to check the connection string and the database status. Root error: ${e}`);
        }

        return mongodbConnection;
    }

    public async run(): Promise<any> {
        const { flags } = await this.parse(BaseCommand);
        process.env.CUSTOM_CONFIG_LOCATION = flags.config;
        this.connectorConfig = createConnectorConfig();
        this.connectorConfig.logging = {
            appenders: {
                console: { type: "console" }
            },
            categories: {
                default: { appenders: ["console"], level: "OFF" }
            }
        };
        this.connectorConfig = this.enhanceConfig(this.connectorConfig);
        try {
            return await this.runInternal(this.connectorConfig);
        } finally {
            if (this.cliRuitime) {
                await this.cliRuitime.stop();
            }
        }
    }
    protected enhanceConfig(connectorConfig: ConnectorRuntimeConfig): ConnectorRuntimeConfig {
        return connectorConfig;
    }

    protected async createRuntime(): Promise<void> {
        if (!this.connectorConfig) throw new Error("Connector config not initialized");
        const loggerFactory = new NodeLoggerFactory(this.connectorConfig.logging);
        this.cliRuitime = new CLIRuntime(this.connectorConfig, loggerFactory);
        await this.cliRuitime.init();
        await this.cliRuitime.start();
    }

    protected abstract runInternal(connectorConfig: ConnectorRuntimeConfig): Promise<any>;
}
