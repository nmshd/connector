import { ConnectorRuntimeModuleConfiguration } from "@nmshd/connector-types";

export interface WebhooksModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    targets?: Record<string, WebhooksModuleConfigurationTarget>;
    webhooks?: WebhooksModuleConfigurationWebhook[];
    skipTlsCheck?: boolean;
    clientId: string;
    clientSecret: string;
    tokenUrl: string;
}

export interface WebhooksModuleConfigurationTarget {
    url: string;
    headers?: Record<string, string>;
}

export interface WebhooksModuleConfigurationWebhook {
    triggers: string[];
    target: WebhooksModuleConfigurationTarget | string;
}
