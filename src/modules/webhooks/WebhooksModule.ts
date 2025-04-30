import { Event, DataEvent as tsUtilsDataEvent } from "@js-soft/ts-utils";
import { ConnectorRuntimeModule } from "@nmshd/connector-types";
import { DataEvent } from "@nmshd/runtime";
import agentKeepAlive from "agentkeepalive";
import axios, { AxiosInstance } from "axios";
import correlator from "correlation-id";
import { DateTime } from "luxon";
import { ConfigModel, Webhook } from "./ConfigModel";
import { ConfigParser } from "./ConfigParser";
import { WebhooksModuleConfiguration } from "./WebhooksModuleConfiguration";

export class WebhooksModule extends ConnectorRuntimeModule<WebhooksModuleConfiguration> {
    private axios: AxiosInstance;
    private configModel: ConfigModel;
    private bearerToken: string;
    private expirationDate: DateTime;
    private tokenSetPromise: Promise<void>;

    public async init(): Promise<void> {
        this.configModel = ConfigParser.parse(this.configuration).value;

        if (!this.configuration.clientId || !this.configuration.clientSecret || !this.configuration.tokenUrl) {
            throw new Error("clientId, clientSecret and tokenUrl are required for OAuth authentication.");
        }

        this.axios = axios.create({
            httpAgent: new agentKeepAlive(),
            httpsAgent: new agentKeepAlive.HttpsAgent({ rejectUnauthorized: !this.configModel.skipTlsCheck }),
            validateStatus: () => true,
            maxRedirects: 0
        });

        this.tokenSetPromise = this.fetchToken();
        await this.tokenSetPromise;
    }

    public start(): void {
        for (const webhook of this.configModel.webhooks) {
            for (const trigger of webhook.triggers) {
                this.subscribeToEvent(trigger, async (event: Event) => await this.handleEvent(event, webhook));
            }
        }
    }

    private async fetchToken() {
        const response = await this.axios.post(
            this.configuration.tokenUrl,
            {
                grant_type: "client_credentials"
            },
            {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                auth: {
                    password: this.configuration.clientSecret,
                    username: this.configuration.clientId
                }
            }
        );

        if (response.status !== 200) {
            throw new Error(`Failed to fetch token: ${response.statusText}`);
        }
        this.expirationDate = DateTime.now().plus({ seconds: response.data.expires_in });
        this.logger.info(`Token expires at ${this.expirationDate.toISO()}`);
        this.bearerToken = response.data.access_token;
    }

    private checkTokenExpiration() {
        if (DateTime.now() > this.expirationDate) {
            this.tokenSetPromise = this.fetchToken();
            return;
        }

        if (DateTime.now().minus({ hours: 1 }) > this.expirationDate) {
            // eslint-disable-next-line no-void
            void this.fetchToken();
        }
    }

    private async handleEvent(event: Event, webhook: Webhook) {
        await this.triggerWebhook(webhook, event.namespace, event instanceof DataEvent || event instanceof tsUtilsDataEvent ? event.data : undefined);
    }

    private async triggerWebhook(webhook: Webhook, trigger: string, data: unknown) {
        this.checkTokenExpiration();
        try {
            await this.tokenSetPromise;
        } catch (e) {
            this.logger.error("Failed to fetch token", e);
            return;
        }
        const url = webhook.target.urlTemplate.fill({ trigger });

        const payload: WebhookPayload = {
            data,
            trigger
        };

        try {
            this.logger.debug(`Sending request to webhook '${url}' for trigger '${trigger}'.`);

            let headers = webhook.target.headers;

            headers = {
                ...headers,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: `Bearer ${this.bearerToken}`
            };

            const correlationId = correlator.getId();
            if (correlationId) headers = { ...headers, "x-correlation-id": correlationId };
            this.logger.info(`Sending request to webhook ${JSON.stringify(payload)}`);
            const response = await this.axios.post(url, payload, { headers });

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
