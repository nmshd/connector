import { PubSub, Topic } from "@google-cloud/pubsub";
import { Event } from "@js-soft/ts-utils";
import { DataEvent } from "@nmshd/runtime";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

export interface PubsubPublisherModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    projectId: string;
    topic: string;
    credentials?: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_email: string;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        private_key: string;
    };
}

export default class PubsubPublisherModule extends ConnectorRuntimeModule<PubsubPublisherModuleConfiguration> {
    private pubsub: PubSub;
    private topic: Topic;

    public init(): void {
        if (!this.configuration.projectId) throw new Error("Cannot start the module, the projectId is not defined.");
        if (!this.configuration.topic) throw new Error("Cannot start the module, the topic is not defined.");

        this.pubsub = new PubSub({ projectId: this.configuration.projectId, credentials: this.configuration.credentials });
        this.topic = this.pubsub.topic(this.configuration.topic);
    }

    public start(): void {
        this.subscribeToEvent("**", this.handleEvent.bind(this));
    }

    private async handleEvent(event: Event) {
        const data = event instanceof DataEvent ? event.data : {};
        const buffer = Buffer.from(JSON.stringify(data));

        await this.topic.publishMessage({
            attributes: { namespace: event.namespace },
            data: buffer
        });
    }

    public async stop(): Promise<void> {
        this.unsubscribeFromAllEvents();

        await this.pubsub.close().catch((e) => this.logger.error("Could not close the pubsub", e));
    }
}
