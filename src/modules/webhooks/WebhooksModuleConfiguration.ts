import { ConnectorRuntimeModuleConfiguration } from "@nmshd/connector-types";

export interface WebhooksModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    targets?: Record<string, WebhooksModuleConfigurationTarget>;
    webhooks?: WebhooksModuleConfigurationWebhook[];
    skipTlsCheck?: boolean;
}

export interface WebhooksModuleConfigurationTarget {
    url: string;
    headers?: Record<string, string>;
    authentication?:
        | {
              type: "OAuth2";
              accessTokenUrl: string;
              clientId: string;
              clientSecret: string;
              scope?: string;
          }
        | {
              type: "ApiKey";
              apiKey: string;
              headerName?: string;
          };
}

export interface WebhooksModuleConfigurationWebhook {
    triggers: string[];
    target: WebhooksModuleConfigurationTarget | string;
}
