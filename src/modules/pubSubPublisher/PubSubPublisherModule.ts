import { PubSub, Topic } from "@google-cloud/pubsub";
import { DataEvent, Event } from "@js-soft/ts-utils";
import { DataEvent as RuntimeDataEvent } from "@nmshd/runtime";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

export interface PubSubPublisherModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    projectId: string;
    topicName: string;
    keyFile: string;
}

export default class PubSubPublisherModule extends ConnectorRuntimeModule<PubSubPublisherModuleConfiguration> {
    private pubSub: PubSub;
    private topic: Topic;

    public async init(): Promise<void> {
        if (!this.configuration.projectId) throw new Error("Cannot start the module, the projectId is not defined.");
        if (!this.configuration.topicName) throw new Error("Cannot start the module, the topic is not defined.");
        if (!this.configuration.keyFile) throw new Error("Cannot start the module, the keyFile is not defined.");

        this.pubSub = new PubSub({
            projectId: this.configuration.projectId,
            keyFile: this.configuration.keyFile
        });

        this.topic = this.pubSub.topic(this.configuration.topicName);
        this.logger.info("Checking if topic exists...");

        const topicExists = (await this.topic.exists())[0];
        if (!topicExists) throw new Error(`Topic ${this.configuration.topicName} does not exist.`);
    }

    public start(): void {
        this.subscribeToEvent("**", this.handleEvent.bind(this));
    }

    private async handleEvent(event: Event) {
        const data = event instanceof DataEvent || event instanceof RuntimeDataEvent ? event.data : {};
        const buffer = Buffer.from(JSON.stringify(data));

        await this.topic
            .publishMessage({
                attributes: { namespace: event.namespace },
                data: buffer
            })
            .catch((e) => this.logger.error("Could not publish message", e));
    }

    public async stop(): Promise<void> {
        this.unsubscribeFromAllEvents();

        await this.pubSub.close().catch((e) => this.logger.error("Could not close the PubSub object", e));
    }
}
