import { DataEvent, Event } from "@js-soft/ts-utils";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "@nmshd/connector-types";
import {
    AMQPConnector,
    AMQPConnectorConfiguration,
    MQTTConnector,
    MQTTConnectorConfiguration,
    MessageBrokerConnector,
    PubSubConnector,
    PubSubConnectorConfiguration,
    RedisConnector,
    RedisConnectorConfiguration
} from "./connectors";

export type Broker =
    | { type: "AMQP"; configuration: AMQPConnectorConfiguration }
    | { type: "MQTT"; configuration: MQTTConnectorConfiguration }
    | { type: "PubSub"; configuration: PubSubConnectorConfiguration }
    | { type: "Redis"; configuration: RedisConnectorConfiguration };

export interface MessageBrokerPublisherModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    brokers: Broker[];
}

export class MessageBrokerPublisherModule extends ConnectorRuntimeModule<MessageBrokerPublisherModuleConfiguration> {
    private readonly connectors: MessageBrokerConnector<any>[] = [];

    public async init(): Promise<void> {
        if (this.configuration.brokers.length === 0) {
            throw new Error("At least one broker must be configured");
        }

        for (const broker of this.configuration.brokers) {
            switch (broker.type) {
                case "AMQP":
                    this.connectors.push(new AMQPConnector(broker.configuration, this.logger));
                    break;
                case "MQTT":
                    this.connectors.push(new MQTTConnector(broker.configuration, this.logger));
                    break;
                case "PubSub":
                    this.connectors.push(new PubSubConnector(broker.configuration, this.logger));
                    break;
                case "Redis":
                    this.connectors.push(new RedisConnector(broker.configuration, this.logger));
                    break;
            }
        }

        for (const connector of this.connectors) {
            await connector.init();
        }
    }

    public start(): void {
        this.subscribeToEvent("**", this.handleEvent.bind(this));
    }

    private async handleEvent(event: Event) {
        const data = event instanceof DataEvent ? event.data : {};
        const buffer = Buffer.from(JSON.stringify(data));

        for (const connector of this.connectors) {
            await connector.publish(event.namespace, buffer);
        }
    }

    public override async stop(): Promise<void> {
        for (const connector of this.connectors) {
            await connector.close();
        }
    }
}
