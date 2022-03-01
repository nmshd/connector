import { DataEvent, Event } from "@nmshd/runtime";
import AgentKeepAlive, { HttpsAgent as AgentKeepAliveHttps } from "agentkeepalive";
import axios, { AxiosInstance } from "axios";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";
import { ConfigModel } from "./ConfigModel";
import { ConfigParser } from "./ConfigParser";

export interface WebhooksModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    url: string;
    headers: Record<string, string>;
    publishInterval: number;
}

export default class WebhooksModule extends ConnectorRuntimeModule<WebhooksModuleConfiguration> {
    private axios: AxiosInstance;
    private readonly eventSubscriptionIds: number[] = [];
    public configModel: ConfigModel;

    private static readonly TARGET_PLACEHOLDER = "{{trigger}}";

    public init(): void {
        this.axios = axios.create({
            httpAgent: new AgentKeepAlive(),
            httpsAgent: new AgentKeepAliveHttps(),
            validateStatus: () => true
        });

        this.configModel = ConfigParser.parse(this.configuration).value;
    }

    public start(): void {
        for (const trigger of this.configModel.webhooks.getDistinctTriggers()) {
            const subscriptionId = this.runtime.eventBus.subscribe(trigger, this.handleEvent.bind(this));
            this.eventSubscriptionIds.push(subscriptionId);
        }
    }

    private async handleEvent(event: Event) {
        await this.publishEvent(event);
    }

    private async publishEvent(event: Event) {
        const webhooks = this.configModel.webhooks.getWebhooksForTrigger(event.namespace);

        for (const webhook of webhooks) {
            const data = event instanceof DataEvent ? event.data : undefined;
            const url = webhook.target.url.replace(WebhooksModule.TARGET_PLACEHOLDER, event.namespace);
            try {
                const response = await this.axios.post(url, data);
                if (response.status !== 200) {
                    this.logger.error(`Webhook ${url} returned status ${response.status}.`);
                }
            } catch (e) {
                this.logger.error(`Webhook ${url} failed with the following error:`, e);
            }
        }
    }

    public stop(): void {
        for (const subscriptionId of this.eventSubscriptionIds) {
            this.runtime.eventBus.unsubscribe(this.handleEvent.bind(this), subscriptionId);
        }
    }
}
