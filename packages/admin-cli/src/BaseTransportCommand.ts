import { NodeLoggerFactory } from "@js-soft/node-logger";
import { EventEmitter2EventBus } from "@js-soft/ts-utils";
import { Transport } from "@nmshd/transport";
import { BaseCommand } from "./BaseCommand";
import { ConnectorRuntimeConfig } from "./connector";

export abstract class BaseTransportCommand extends BaseCommand {
    private transport?: Transport;

    protected async runInternal(connectorConfig: ConnectorRuntimeConfig): Promise<void> {
        let databaseConnection;
        let logger;
        try {
            const eventBus = new EventEmitter2EventBus(() => {
                // ignore errors
            });
            logger = new NodeLoggerFactory(connectorConfig.logging);
            databaseConnection = await BaseCommand.createDBConnection(connectorConfig);

            this.transport = new Transport(databaseConnection, { ...connectorConfig.transportLibrary, supportedIdentityVersion: 1 }, eventBus, logger);
            await this.transport.init();
            return await this.runInternalWithTransport(this.transport, connectorConfig);
        } catch (error: any) {
            this.log.log("Error creating identity: ", error.stack);
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

    protected abstract runInternalWithTransport(transport: Transport, connectorConfig: ConnectorRuntimeConfig): Promise<any>;
}
