import { MessageDTO, MessageReceivedEvent, RelationshipChangedEvent, RelationshipDTO } from "@nmshd/runtime";
import AgentKeepAlive, { HttpsAgent as AgentKeepAliveHttps } from "agentkeepalive";
import axios, { AxiosInstance } from "axios";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

export interface HttpEndpointEventPublisherModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    url: string;
    headers: Record<string, string>;
    publishInterval: number;
}

export default class HttpEndpointEventPublisherModule extends ConnectorRuntimeModule<HttpEndpointEventPublisherModuleConfiguration> {
    private axios: AxiosInstance;
    private readonly unpublishedRelationships: RelationshipDTO[] = [];
    private readonly unpublishedMessages: MessageDTO[] = [];
    private publishAllInterval: NodeJS.Timeout;

    private messageReceivedSubscriptionId: number | undefined;
    private relationshipChangedSubscriptionId: number | undefined;

    public init(): void {
        this.axios = axios.create({
            httpAgent: new AgentKeepAlive(),
            httpsAgent: new AgentKeepAliveHttps()
        });

        this.messageReceivedSubscriptionId = this.runtime.eventBus.subscribe<MessageReceivedEvent>(MessageReceivedEvent, (e) => this.messageReceived(e));
        this.relationshipChangedSubscriptionId = this.runtime.eventBus.subscribe<RelationshipChangedEvent>(RelationshipChangedEvent, (e) => this.relationshipChanged(e));
    }

    private messageReceived(event: MessageReceivedEvent) {
        this.unpublishedMessages.push(event.data);
    }

    private relationshipChanged(event: RelationshipChangedEvent) {
        this.unpublishedRelationships.push(event.data);
    }

    public start(): void {
        this.publishAllInterval = setInterval(() => this.publishAll(), this.configuration.publishInterval * 1000);
    }

    private async publishAll() {
        const relationshipsToPublish = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.unpublishedRelationships.length; i++) {
            relationshipsToPublish.push(this.unpublishedRelationships.shift());
        }

        const messagesToPublish = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.unpublishedMessages.length; i++) {
            messagesToPublish.push(this.unpublishedMessages.shift());
        }

        const numberOfUnpublishedItems = messagesToPublish.length + relationshipsToPublish.length;

        if (numberOfUnpublishedItems === 0) {
            return;
        }

        this.logger.info(`Sending (${numberOfUnpublishedItems}) items to ${this.configuration.url}...`);

        try {
            const data = {
                relationships: relationshipsToPublish,
                messages: messagesToPublish
            };

            await this.axios.post(this.configuration.url, data, { headers: this.configuration.headers });
        } catch (e) {
            this.logger.error("There was an error while sending unpublished items to the configured http endpoint:", e);
        }
    }

    public async stop(): Promise<void> {
        clearInterval(this.publishAllInterval);

        if (this.messageReceivedSubscriptionId) {
            this.runtime.eventBus.unsubscribe(MessageReceivedEvent, this.messageReceivedSubscriptionId);
        }

        if (this.relationshipChangedSubscriptionId) {
            this.runtime.eventBus.unsubscribe(RelationshipChangedEvent, this.relationshipChangedSubscriptionId);
        }

        await this.publishAll();
    }
}
