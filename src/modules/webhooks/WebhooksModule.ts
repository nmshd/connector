import { Event, DataEvent as tsUtilsDataEvent } from "@js-soft/ts-utils";
import { ConnectorRuntimeModule } from "@nmshd/connector-types";
import { DataEvent } from "@nmshd/runtime";
import { HttpAgent as HttpKeepaliveAgent, HttpsAgent as HttpsKeepaliveAgent } from "agentkeepalive";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import correlator from "correlation-id";
import { ConfigModel, Webhook } from "./ConfigModel";
import { ConfigParser } from "./ConfigParser";
import { WebhooksModuleConfiguration } from "./WebhooksModuleConfiguration";

export class WebhooksModule extends ConnectorRuntimeModule<WebhooksModuleConfiguration> {
    private axios: AxiosInstance;
    private configModel: ConfigModel;

    public init(): void {
        this.configModel = ConfigParser.parse(this.configuration).value;

        this.axios = axios.create({
            httpAgent: new agentKeepAlive(),
            httpsAgent: new agentKeepAlive.HttpsAgent({ rejectUnauthorized: !this.configModel.skipTlsCheck }),
            validateStatus: () => true,
            maxRedirects: 0
        });
    }

    public start(): void {
        for (const webhook of this.configModel.webhooks) {
            for (const trigger of webhook.triggers) {
                this.subscribeToEvent(trigger, async (event: Event) => await this.handleEvent(event, webhook));
            }
        }
    }

    private async handleEvent(event: Event, webhook: Webhook) {
        await this.triggerWebhook(webhook, event.namespace, event instanceof DataEvent || event instanceof tsUtilsDataEvent ? event.data : undefined);
    }

    private async triggerWebhook(webhook: Webhook, trigger: string, data: unknown) {
        const url = webhook.target.urlTemplate.fill({ trigger });

        const payload: WebhookPayload = {
            data,
            trigger
        };

        try {
            this.logger.debug(`Sending request to webhook '${url}' for trigger '${trigger}'.`);

            const headers: Record<string, string> = { ...webhook.target.headers };

            const correlationId = correlator.getId();
            if (correlationId) headers["x-correlation-id"] = correlationId;
            this.logger.info(`Sending request to webhook ${JSON.stringify(payload)}`);

            const config: AxiosRequestConfig = { headers };

            if (webhook.target.authenticator) {
                await webhook.target.authenticator.authenticate(config);
            }

            const response = await this.axios.post(url, payload, config);

            if (response.status < 200 || response.status > 299) {
                this.logger.warn(`Request to webhook '${url}' returned status ${response.status}. Expected value between 200 and 299.`);
            } else {
                this.logger.debug(`Request to webhook '${url}' was successful.`);
            }
        } catch (e) {
            this.logger.error(`Request to webhook '${url}' failed with the following error:`, e);
        }
    }
}

interface WebhookPayload {
    trigger: string;
    data: unknown;
}
