import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { LokiJsConnection } from "@js-soft/docdb-access-loki";
import { MongoDbConnection } from "@js-soft/docdb-access-mongo";
import { NodeLoggerFactory } from "@js-soft/node-logger";
import { EventEmitter2EventBus } from "@js-soft/ts-utils";
import { Transport } from "@nmshd/transport";
import yargs from "yargs";
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
    protected transport?: Transport;
    protected connectorConfig?: ConnectorRuntimeConfig;
    protected log = console;

    public async run(configPath: string | undefined): Promise<void> {
        let databaseConnection;
        let logger;
        try {
            this.connectorConfig = createConnectorConfig(undefined, configPath);
            this.connectorConfig.transportLibrary.allowIdentityCreation = true;
            this.connectorConfig.logging = {
                appenders: {
                    console: { type: "console" }
                },
                categories: {
                    default: { appenders: ["console"], level: "OFF" }
                }
            };

            const eventBus = new EventEmitter2EventBus(() => {
                // ignore errors
            });
            logger = new NodeLoggerFactory(this.connectorConfig.logging);
            databaseConnection = await BaseCommand.createDBConnection(this.connectorConfig);

            this.transport = new Transport(databaseConnection, { ...this.connectorConfig.transportLibrary, supportedIdentityVersion: 1 }, eventBus, logger);
            await this.transport.init();

            return await this.runInternal();
        } catch (error: any) {
            this.log.error("Error creating identity: ", error.message);
        } finally {
            if (databaseConnection) {
                await databaseConnection.close();
            }
            if (this.transport) {
                await this.transport.eventBus.close();
            }
            if (logger) {
                logger.close();
            }
        }
    }

    public abstract runInternal(): Promise<any>;

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
}
