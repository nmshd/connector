import { ILogger } from "@js-soft/logging-abstractions";
import { AmqpConnectionManager, ChannelWrapper, connect as amqpConnect } from "amqp-connection-manager";
import { MessageBrokerConnector } from "./MessageBrokerConnector";

export interface AMQPConnectorConfiguration {
    url: string;
    exchange?: string;
    timeout?: number;
}

export class AMQPConnector extends MessageBrokerConnector<AMQPConnectorConfiguration> {
    private connection?: AmqpConnectionManager;
    private channel?: ChannelWrapper;

    public constructor(configuration: AMQPConnectorConfiguration, logger: ILogger) {
        super(configuration, logger);

        if (!this.configuration.url) throw new Error("Cannot start the module, the ampq url is not defined.");
    }

    public async init(): Promise<void> {
        const url = this.configuration.url;

        this.connection = amqpConnect(url, { connectionOptions: { timeout: this.configuration.timeout ?? 2000 } });

        await this.connection.connect().catch((e) => {
            throw new Error(`Could not connect to RabbitMQ at '${url}' (${e.message})`);
        });

        const exchange = this.configuration.exchange ?? "";
        this.channel = this.connection.createChannel({ json: true });

        await this.channel.checkExchange(exchange).catch(() => {
            throw new Error(`The configured exchange '${exchange}' does not exist.`);
        });
    }

    public async publish(namespace: string, data: Buffer): Promise<void> {
        const exchangeName = this.configuration.exchange ?? "";

        const sent = await this.channel!.publish(exchangeName, namespace, data);
        if (!sent) {
            this.logger.error(`Publishing event '${namespace}' to exchange '${exchangeName}' failed.`);
        }
    }

    public async close(): Promise<void> {
        await this.channel?.close().catch((e) => this.logger.error("Could not close the RabbitMQ channel", e));
        await this.connection?.close().catch((e) => this.logger.error("Could not close the RabbitMQ connection", e));
    }
}
