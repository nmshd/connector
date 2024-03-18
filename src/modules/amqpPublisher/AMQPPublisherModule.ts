import { Event } from "@js-soft/ts-utils";
import { DataEvent } from "@nmshd/runtime";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";
import { AMQPConnector } from "../messageBrokerPublisher/connectors/AMQPConnector";

export interface AMQPPublisherModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    url: string;
    exchange?: string;
    timeout?: number;
}

export default class AMQPPublisherModule extends ConnectorRuntimeModule<AMQPPublisherModuleConfiguration> {
    private amqpConnector: AMQPConnector;

    public async init(): Promise<void> {
        this.logger.warn("AMQPPublisherModule is deprecated and will be removed in the future. Please use MessageBrokerPublisherModule instead.");

        this.amqpConnector = new AMQPConnector(this.configuration, this.logger);
        await this.amqpConnector.init();
    }

    public start(): void {
        this.subscribeToEvent("**", this.handleEvent.bind(this));
    }

    private handleEvent(event: Event) {
        const data = event instanceof DataEvent ? event.data : {};
        const buffer = Buffer.from(JSON.stringify(data));

        this.amqpConnector.publish(event.namespace, buffer);
    }

    public async stop(): Promise<void> {
        this.unsubscribeFromAllEvents();

        await this.amqpConnector.close();
    }
}
