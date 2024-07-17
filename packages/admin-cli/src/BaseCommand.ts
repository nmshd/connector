import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { LokiJsConnection } from "@js-soft/docdb-access-loki";
import { MongoDbConnection } from "@js-soft/docdb-access-mongo";
import { NodeLoggerFactory } from "@js-soft/node-logger";
import { EventEmitter2EventBus } from "@js-soft/ts-utils";
import { Transport } from "@nmshd/transport";
import { Command, Flags } from "@oclif/core";
import { ConnectorRuntimeConfig, createConnectorConfig, DocumentationLink } from "./connector";

export abstract class BaseCommand extends Command {
    public static readonly flags = {
        config: Flags.string({ description: "config file", char: "c", default: "./config.json" })
    };

    protected transport?: Transport;
    protected connectorConfig?: ConnectorRuntimeConfig;

    public async run(): Promise<void> {
        const { flags } = await this.parse(BaseCommand);
        process.env.CUSTOM_CONFIG_LOCATION = flags.config;

        this.connectorConfig = createConnectorConfig();
        this.connectorConfig.transportLibrary.allowIdentityCreation = true;
        this.connectorConfig.logging = {
            appenders: {
                console: { type: "console" }
            },
            categories: {
                default: { appenders: ["console"], level: "OFF" }
            }
        };

        let databaseConnection;
        let logger;
        try {
            const eventBus = new EventEmitter2EventBus(() => {
                // ignore errors
            });
            logger = new NodeLoggerFactory(this.connectorConfig.logging);
            databaseConnection = await BaseCommand.createDBConnection(this.connectorConfig);

            this.transport = new Transport(databaseConnection, { ...this.connectorConfig.transportLibrary, supportedIdentityVersion: 1 }, eventBus, logger);
            await this.transport.init();

            await this.runInternal();
        } catch (error: any) {
            this.log("Error creating identity: ", error.stack);
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

    public abstract runInternal(): Promise<void>;

    public static async createDBConnection(runtimeConfig: ConnectorRuntimeConfig): Promise<IDatabaseConnection> {
        if (runtimeConfig.database.driver === "lokijs") {
            if (!runtimeConfig.debug) throw new Error("LokiJS is only available in debug mode.");

            const folder = runtimeConfig.database.folder;
            if (!folder) throw new Error("No folder provided for LokiJS database.");

            return new LokiJsConnection(folder, undefined, { autoload: true, autosave: true, persistenceMethod: "fs" });
        }

        if (!runtimeConfig.database.connectionString) {
            this.error(`No database connection string provided. See ${DocumentationLink.operate__configuration("database")} on how to configure the database connection.`);
            process.exit(1);
        }

        const mongodbConnection = new MongoDbConnection(runtimeConfig.database.connectionString);

        try {
            await mongodbConnection.connect();
        } catch (e) {
            this.error(`Could not connect to the configured database. Try to check the connection string and the database status. Root error: ${e}`);

            process.exit(1);
        }

        return mongodbConnection;
    }
}
