import { DataEvent, Event } from "@js-soft/ts-utils";
import { DataEvent as RuntimeDataEvent } from "@nmshd/runtime";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";
import { PubSubConnector } from "../messageBrokerPublisher/connectors/PubSubConnector";

export interface PubSubPublisherModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    projectId: string;
    topicName: string;
    keyFile: string;
}

export default class PubSubPublisherModule extends ConnectorRuntimeModule<PubSubPublisherModuleConfiguration> {
    private pubSubConnector: PubSubConnector;

    public async init(): Promise<void> {
        this.logger.warn("PubSubPublisherModule is deprecated and will be removed in the future. Please use MessageBrokerPublisherModule instead.");

        this.pubSubConnector = new PubSubConnector(this.configuration, this.logger);
        await this.pubSubConnector.init();
    }

    public start(): void {
        this.subscribeToEvent("**", this.handleEvent.bind(this));
    }

    private async handleEvent(event: Event) {
        const data = event instanceof DataEvent || event instanceof RuntimeDataEvent ? event.data : {};
        const buffer = Buffer.from(JSON.stringify(data));

        await this.pubSubConnector.publish(event.namespace, buffer);
    }

    public async stop(): Promise<void> {
        this.unsubscribeFromAllEvents();

        await this.pubSubConnector.close();
    }
}
