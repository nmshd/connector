import { ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

export interface WebhooksModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    targets?: Record<string, WebhooksModuleConfigurationTarget>;
    webhooks?: WebhooksModuleConfigurationWebhook[];
}

export interface WebhooksModuleConfigurationTarget {
    url: string;
    headers?: Record<string, string>;
}

export interface WebhooksModuleConfigurationWebhook {
    triggers: string[];
    target: WebhooksModuleConfigurationTarget | string;
}
