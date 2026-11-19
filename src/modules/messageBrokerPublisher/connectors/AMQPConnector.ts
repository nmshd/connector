import { ILogger } from "@js-soft/logging-abstractions";
import amqp from "amqplib";
import { MessageBrokerConnector } from "./MessageBrokerConnector";

export interface AMQPConnectorConfiguration {
    url: string;
    exchange?: string;
    timeout?: number;
}

export class AMQPConnector extends MessageBrokerConnector<AMQPConnectorConfiguration> {
    private connection?: amqp.ChannelModel;
    private channel?: amqp.Channel;
    private connectPromise?: Promise<void>;
    private reconnectTimer?: NodeJS.Timeout;
    private isClosing = false;
    private static readonly reconnectIntervalMs = 3000;

    public constructor(configuration: AMQPConnectorConfiguration, logger: ILogger) {
        super(configuration, logger);

        if (!this.configuration.url) throw new Error("Cannot start the module, the amqp url is not defined.");
    }

    public async init(): Promise<void> {
        await this.ensureConnected();
    }

    public async publish(namespace: string, data: Buffer): Promise<void> {
        try {
            await this.ensureConnected();
        } catch (error) {
            this.scheduleReconnect();
            this.logger.error(`Publishing event '${namespace}' to RabbitMQ failed.`, error);
            return;
        }

        try {
            this.publishOnCurrentChannel(namespace, data);
            return;
        } catch (_error) {
            this.channel = undefined;
        }

        try {
            await this.ensureConnected();
            this.publishOnCurrentChannel(namespace, data);
        } catch (retryError) {
            this.scheduleReconnect();
            this.logger.error(`Publishing event '${namespace}' to RabbitMQ failed.`, retryError);
        }
    }

    private publishOnCurrentChannel(namespace: string, data: Buffer): void {
        if (!this.channel) throw new Error("Cannot publish the event because the RabbitMQ channel is not connected.");

        const exchangeName = this.configuration.exchange ?? "";
        const sent = this.channel.publish(exchangeName, namespace, data);
        if (!sent) {
            this.logger.error(`Publishing event '${namespace}' to exchange '${exchangeName}' failed.`);
        }
    }

    private async ensureConnected(): Promise<void> {
        if (this.isClosing) throw new Error("Cannot connect to RabbitMQ because the connector is closing.");

        this.clearReconnectTimer();

        if (this.channel) return;

        if (this.connectPromise) {
            await this.connectPromise;
            return;
        }

        const connectPromise = this.connect();
        this.connectPromise = connectPromise;

        try {
            await connectPromise;
        } finally {
            if (this.connectPromise === connectPromise) this.connectPromise = undefined;
        }
    }

    private async connect(): Promise<void> {
        const url = this.configuration.url;

        const connection =
            this.connection ??
            (await amqp.connect(url, { timeout: this.configuration.timeout ?? 2000 }).catch((e) => {
                throw new Error(`Could not connect to RabbitMQ at '${url}' (${e.message})`);
            }));

        if (this.isClosing) {
            await connection.close().catch((e) => this.logger.error("Could not close the RabbitMQ connection", e));
            throw new Error("Cannot connect to RabbitMQ because the connector is closing.");
        }

        if (!this.connection) {
            this.connection = connection;
            this.registerConnectionListeners(connection);
        }

        const channel = await connection.createChannel().catch((e) => {
            if (this.connection === connection) this.connection = undefined;
            throw new Error(`Could not create a channel for RabbitMQ (${e.message})`);
        });

        const exchange = this.configuration.exchange ?? "";
        await channel.checkExchange(exchange).catch(async () => {
            await channel.close().catch((e) => this.logger.error("Could not close the RabbitMQ channel after exchange check failed", e));
            throw new Error(`The configured exchange '${exchange}' does not exist.`);
        });

        if (this.isConnectorClosing()) {
            await channel.close().catch((e) => this.logger.error("Could not close the RabbitMQ channel", e));
            throw new Error("Cannot connect to RabbitMQ because the connector is closing.");
        }

        this.channel = channel;
        this.registerChannelListeners(channel);
    }

    private isConnectorClosing(): boolean {
        return this.isClosing;
    }

    private registerConnectionListeners(connection: amqp.ChannelModel): void {
        connection.on("error", (error) => {
            if (this.isClosing) return;

            this.logger.error("RabbitMQ connection error.", error);
        });

        connection.on("close", () => {
            if (this.connection !== connection) return;

            this.connection = undefined;
            this.channel = undefined;

            if (this.isClosing) return;

            this.logger.error("RabbitMQ connection closed. Trying to reconnect.");
            this.scheduleReconnect();
        });
    }

    private registerChannelListeners(channel: amqp.Channel): void {
        channel.on("error", (error) => {
            if (this.isClosing) return;

            this.logger.error("RabbitMQ channel error.", error);
        });

        channel.on("close", () => {
            if (this.channel !== channel) return;

            this.channel = undefined;

            if (this.isClosing) return;

            this.logger.error("RabbitMQ channel closed. Trying to reconnect.");
            this.scheduleReconnect();
        });
    }

    private scheduleReconnect(): void {
        if (this.isClosing || this.reconnectTimer) return;

        this.reconnectTimer = setTimeout(async () => {
            this.reconnectTimer = undefined;

            try {
                await this.ensureConnected();
                this.logger.info("Re-established the RabbitMQ connection.");
            } catch (error) {
                if (this.isClosing) return;

                this.logger.error(`Could not re-establish the RabbitMQ connection. Trying again in ${AMQPConnector.reconnectIntervalMs / 1000} seconds.`, error);
                this.scheduleReconnect();
            }
        }, AMQPConnector.reconnectIntervalMs);
    }

    private clearReconnectTimer(): void {
        if (!this.reconnectTimer) return;

        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = undefined;
    }

    public async close(): Promise<void> {
        this.isClosing = true;
        this.clearReconnectTimer();

        const channel = this.channel;
        const connection = this.connection;
        this.channel = undefined;
        this.connection = undefined;

        await channel?.close().catch((e) => this.logger.error("Could not close the RabbitMQ channel", e));
        await connection?.close().catch((e) => this.logger.error("Could not close the RabbitMQ connection", e));
    }
}
