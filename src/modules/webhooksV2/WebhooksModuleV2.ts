import { DataEvent, Event } from "@nmshd/runtime";
import AgentKeepAlive, { HttpsAgent as AgentKeepAliveHttps } from "agentkeepalive";
import axios, { AxiosInstance } from "axios";
import { ConnectorRuntimeModule } from "../../ConnectorRuntimeModule";
import { ConfigModel, Webhook } from "./ConfigModel";
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

        const promises = webhooksForTrigger.map((webhook) => this.triggerWebhook(webhook, trigger, data));

        await Promise.all(promises);
    }

    private async triggerWebhook(webhook: Webhook, trigger: string, data: unknown) {
        const url = webhook.target.urlTemplate.fill({ trigger });

        const payload: WebhookPayload = {
            data,
            trigger
        };

        try {
            this.logger.debug(`Sending request to webhook '${url}' for trigger '${trigger}'.`);

            const response = await this.axios.post(url, payload, { headers: webhook.target.headers });

            if (response.status !== 200) {
                this.logger.warn(`Request to webhook '${url}' returned status ${response.status}. Expected 200.`);
            } else {
                this.logger.debug(`Request to webhook '${url}' was successful.`);
            }
        } catch (e) {
            this.logger.error(`Request to webhook '${url}' failed with the following error:`, e);
        }
    }

    public stop(): void {
        for (const subscriptionId of this.eventSubscriptionIds) {
            this.runtime.eventBus.unsubscribe(this.handleEvent.bind(this), subscriptionId);
        }
    }
}

interface WebhookPayload {
    trigger: string;
    data: unknown;
}
