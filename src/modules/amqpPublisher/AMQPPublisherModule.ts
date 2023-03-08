import { Event } from "@js-soft/ts-utils";
import { DataEvent } from "@nmshd/runtime";
import amqp from "amqplib";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

export interface AMQPPublisherModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    url: string;
    exchange?: string;
    timeout?: number;
}

export default class AMQPPublisherModule extends ConnectorRuntimeModule<AMQPPublisherModuleConfiguration> {
    private connection?: amqp.Connection;
    private channel?: amqp.Channel;

    public init(): void {
        if (!this.configuration.url) throw new Error("Cannot start the module, the ampq url is not defined.");
    }

    public async start(): Promise<void> {
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

        this.subscribeToEvent("**", this.handleEvent.bind(this));
    }

    private handleEvent(event: Event) {
        const data = event instanceof DataEvent ? event.data : {};
        const buffer = Buffer.from(JSON.stringify(data));

        const exchangeName = this.configuration.exchange ?? "";

        const sent = this.channel!.publish(exchangeName, event.namespace, buffer);
        if (!sent) {
            this.logger.error(`Publishing event '${event.namespace}' to exchange '${exchangeName}' failed.`);
        }
    }

    public async stop(): Promise<void> {
        this.unsubscribeFromAllEvents();

        await this.channel?.close().catch((e) => this.logger.error("Could not close the RabbitMQ channel", e));
        await this.connection?.close().catch((e) => this.logger.error("Could not close the RabbitMQ connection", e));
    }
}
