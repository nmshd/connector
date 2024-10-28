import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { LokiJsConnection } from "@js-soft/docdb-access-loki";
import { MongoDbConnection } from "@js-soft/docdb-access-mongo";
import yargs from "yargs";
import { ConnectorRuntime } from "../ConnectorRuntime";
import { ConnectorRuntimeConfig, createConnectorConfig } from "../ConnectorRuntimeConfig";
import { DocumentationLink } from "../DocumentationLink";

export interface ConfigFileOptions {
    config: string | undefined;
}

export const configOptionBuilder = (yargs: yargs.Argv<{}>): yargs.Argv<ConfigFileOptions> => {
    return yargs.option("config", {
        alias: "c",
        describe: `Path to the custom configuration file
Can also be set via the CUSTOM_CONFIG_LOCATION env variable`,
        type: "string",
        demandOption: false
    });
};

export abstract class BaseCommand {
    private connectorConfig?: ConnectorRuntimeConfig;
    protected cliRuntime?: ConnectorRuntime;
    protected log = console;

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

    public async run(configPath: string | undefined): Promise<any> {
        if (configPath) {
            process.env.CUSTOM_CONFIG_LOCATION = configPath;
        }

        try {
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
            return await this.runInternal(this.connectorConfig);
        } catch (error: any) {
            this.log.log("Error creating identity: ", error);
        } finally {
            if (this.cliRuntime) {
                await this.cliRuntime.stop();
            }
        }
    }

    protected enhanceConfig(connectorConfig: ConnectorRuntimeConfig): ConnectorRuntimeConfig {
        return connectorConfig;
    }

    protected async createRuntime(): Promise<void> {
        if (this.cliRuntime) {
            return;
        }
        if (!this.connectorConfig) throw new Error("Connector config not initialized");
        this.cliRuntime = await ConnectorRuntime.create(this.connectorConfig);
        await this.cliRuntime.start();
    }

    protected abstract runInternal(connectorConfig: ConnectorRuntimeConfig): Promise<void>;
}
