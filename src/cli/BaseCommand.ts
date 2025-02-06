import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { LokiJsConnection } from "@js-soft/docdb-access-loki";
import { MongoDbConnection } from "@js-soft/docdb-access-mongo";
import { NodeLoggerFactory } from "@js-soft/node-logger";
import { EventEmitter2EventBus } from "@js-soft/ts-utils";
import { Transport } from "@nmshd/transport";
import yargs from "yargs";
import { ConnectorRuntime } from "../ConnectorRuntime";
import { ConnectorRuntimeConfig } from "../ConnectorRuntimeConfig";
import { createConnectorConfig } from "../CreateConnectorConfig";
import { DocumentationLink } from "../DocumentationLink";

export interface ConfigFileOptions {
    config?: string;
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
    protected connectorConfig?: ConnectorRuntimeConfig;
    protected cliRuntime?: ConnectorRuntime;
    protected transport?: Transport;
    protected log = console;
    private databaseConnection: IDatabaseConnection;

    public async run(configPath: string | undefined): Promise<any> {
        if (configPath) {
            process.env.CUSTOM_CONFIG_LOCATION = configPath;
        }

        try {
            this.connectorConfig = createConnectorConfig();
            this.connectorConfig.infrastructure.httpServer.enabled = false;
            this.connectorConfig.modules.coreHttpApi.enabled = false;
            this.connectorConfig.logging = {
                appenders: {
                    console: { type: "console" }
                },
                categories: {
                    default: { appenders: ["console"], level: "OFF" }
                }
            };
            return await this.runInternal(this.connectorConfig);
        } catch (error: any) {
            this.log.log("Error creating identity: ", error);
        } finally {
            if (this.cliRuntime) {
                await this.cliRuntime.stop();
            }
            if (this.transport) {
                await this.transport.eventBus.close();
                await this.databaseConnection.close();
            }
        }
    }

    protected async createTransport(): Promise<void> {
        if (this.transport) {
            return;
        }
        if (!this.connectorConfig) throw new Error("Connector config not initialized");
        const eventBus = new EventEmitter2EventBus(() => {
            // ignore errors
        });
        const logger = new NodeLoggerFactory(this.connectorConfig.logging);
        this.databaseConnection = await BaseCommand.createDBConnection(this.connectorConfig);

        this.transport = new Transport(this.databaseConnection, { ...this.connectorConfig.transportLibrary, supportedIdentityVersion: 1 }, eventBus, logger);
        await this.transport.init();
    }

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
