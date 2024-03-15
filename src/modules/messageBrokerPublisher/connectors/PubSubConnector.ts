import { PubSub, Topic } from "@google-cloud/pubsub";
import { ILogger } from "@js-soft/logging-abstractions";
import { MessageBrokerConnector } from "./MessageBrokerConnector";

export interface PubSubConnectorConfiguration {
    projectId: string;
    topicName: string;
    keyFile: string;
}

export class PubSubConnector extends MessageBrokerConnector<PubSubConnectorConfiguration> {
    private readonly pubSub: PubSub;
    private topic: Topic;

    public constructor(configuration: PubSubConnectorConfiguration, logger: ILogger) {
        super(configuration, logger);

        if (!this.configuration.projectId) throw new Error("Cannot start the module, the projectId is not defined.");
        if (!this.configuration.topicName) throw new Error("Cannot start the module, the topic is not defined.");
        if (!this.configuration.keyFile) throw new Error("Cannot start the module, the keyFile is not defined.");

        this.pubSub = new PubSub({
            projectId: this.configuration.projectId,
            keyFile: this.configuration.keyFile
        });
    }

    public async init(): Promise<void> {
        this.logger.info(`Initializing PubSubPublisherModule with projectId '${this.configuration.projectId}' and topicName '${this.configuration.topicName}'.`);

        this.topic = this.pubSub.topic(this.configuration.topicName);
        this.logger.info("Checking if topic exists...");

        const topicExists = (await this.topic.exists())[0];
        if (!topicExists) throw new Error(`Topic '${this.configuration.topicName}' does not exist in the project '${this.configuration.projectId}'.`);
    }

    public async publish(namespace: string, data: Buffer): Promise<void> {
        try {
            await this.topic.publishMessage({ attributes: { namespace }, data });
        } catch (e) {
            this.logger.error(`Could not publish message with namespace '${namespace}'`, e);
        }
    }

    public async close(): Promise<void> {
        await this.pubSub.close().catch((e) => this.logger.error("Could not close the PubSub object", e));
    }
}
