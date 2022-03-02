import { DataEvent, Event } from "@nmshd/runtime";
import AgentKeepAlive, { HttpsAgent as AgentKeepAliveHttps } from "agentkeepalive";
import axios, { AxiosInstance } from "axios";
import { ConnectorRuntimeModule } from "../../ConnectorRuntimeModule";
import { ConfigModel } from "./ConfigModel";
import { ConfigParser } from "./ConfigParser";
import { WebhooksModuleConfiguration } from "./WebhooksModuleConfiguration";

export default class WebhooksModuleV2 extends ConnectorRuntimeModule<WebhooksModuleConfiguration> {
    private readonly eventSubscriptionIds: number[] = [];
    private axios: AxiosInstance;
    private configModel: ConfigModel;

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
        await this.triggerWebhooks(event.namespace, event instanceof DataEvent ? event.data : undefined);
    }

    private async triggerWebhooks(trigger: string, data?: unknown) {
        const webhooksForTrigger = this.configModel.webhooks.getWebhooksForTrigger(trigger);

        const promises = webhooksForTrigger.map((webhook) => this.trySend(webhook.target.urlTemplate.fill({ trigger }), data));

        await Promise.all(promises);
    }

    private async trySend(url: string, data: unknown) {
        try {
            const response = await this.axios.post(url, data);
            if (response.status !== 200) {
                this.logger.error(`Webhook ${url} returned status ${response.status}.`);
            }
        } catch (e) {
            this.logger.error(`Webhook ${url} failed with the following error:`, e);
        }
    }

    public stop(): void {
        for (const subscriptionId of this.eventSubscriptionIds) {
            this.runtime.eventBus.unsubscribe(this.handleEvent.bind(this), subscriptionId);
        }
    }
}
