import amqp from "amqplib";
import { MessageBrokerConnector } from "./MessageBrokerConnector";

export interface AMQPConnectorConfiguration {
    url: string;
    exchange?: string;
    timeout?: number;
}

export class AMQPConnector extends MessageBrokerConnector<AMQPConnectorConfiguration> {
    private connection?: amqp.Connection;
    private channel?: amqp.Channel;

    public async init(): Promise<void> {
        const url = this.configuration.url;

        this.connection = await amqp.connect(url, { timeout: this.configuration.timeout ?? 2000 }).catch((e) => {
            throw new Error(`Could not connect to RabbitMQ at '${url}' (${e.message})`);
        });

        this.channel = await this.connection.createChannel().catch((e) => {
            throw new Error(`Could not create a channel for RabbitMQ' (${e.message})`);
        });

        const exchange = this.configuration.exchange ?? "";
        await this.channel.checkExchange(exchange).catch(() => {
            throw new Error(`The configured exchange '${exchange}' does not exist.`);
        });
    }

    public publish(namespace: string, data: Buffer): void {
        const exchangeName = this.configuration.exchange ?? "";

        const sent = this.channel!.publish(exchangeName, namespace, data);
        if (!sent) {
            this.logger.error(`Publishing event '${namespace}' to exchange '${exchangeName}' failed.`);
        }
    }

    public async close(): Promise<void> {
        await this.channel?.close().catch((e) => this.logger.error("Could not close the RabbitMQ channel", e));
        await this.connection?.close().catch((e) => this.logger.error("Could not close the RabbitMQ connection", e));
    }
}
