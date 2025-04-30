import { Result } from "@js-soft/ts-utils";
import { AuthenticationProvider, OAuth2AuthenticationProvider } from "./authentication";
import { ConfigModel, Target, Webhook, WebhookUrlTemplate } from "./ConfigModel";
import { WebhooksModuleApplicationErrors } from "./WebhooksModuleApplicationErrors";
import { WebhooksModuleConfiguration, WebhooksModuleConfigurationWebhook } from "./WebhooksModuleConfiguration";

export class ConfigParser {
    public static parse(configJson: WebhooksModuleConfiguration): Result<ConfigModel> {
        const namedTargetsResult = ConfigParser.parseNamedTargets(configJson);
        if (namedTargetsResult.isError) return Result.fail(namedTargetsResult.error);

        const webhooks = ConfigParser.parseWebhooks(configJson, namedTargetsResult.value);

        if (webhooks.isError) {
            return Result.fail(webhooks.error);
        }

        const configModel = new ConfigModel(webhooks.value, configJson.skipTlsCheck ?? false);
        return Result.ok(configModel);
    }

    private static parseNamedTargets(configJson: WebhooksModuleConfiguration): Result<Record<string, Target | undefined>> {
        const targets: Record<string, Target | undefined> = {};

        for (const targetName in configJson.targets) {
            const targetJson = configJson.targets[targetName];
            const targetModelResult = ConfigParser.createTarget(targetJson.url, targetJson.headers, targetJson.authenticationProvider);
            if (targetModelResult.isError) return Result.fail(targetModelResult.error);

            targets[targetName] = targetModelResult.value;
        }

        return Result.ok(targets);
    }

    private static createTarget(url: string, headers: Record<string, string> | undefined, authenticationProviderConfig: Record<string, unknown> | undefined): Result<Target> {
        const urlTemplateResult = WebhookUrlTemplate.fromString(url);
        if (urlTemplateResult.isError) return Result.fail(urlTemplateResult.error);

        const authenticationProvider = this.createAuthenticationProvider(authenticationProviderConfig);
        const target = new Target(urlTemplateResult.value, headers ?? {}, authenticationProvider.value);

        return Result.ok(target);
    }

    private static createAuthenticationProvider(authenticationProviderConfig: Record<string, unknown> | undefined): Result<AuthenticationProvider | undefined> {
        if (!authenticationProviderConfig) return Result.ok(undefined);
        if (typeof authenticationProviderConfig !== "object") {
            return Result.fail(WebhooksModuleApplicationErrors.invalidAuthenticationProviderConfig("'authenticationProvider' must be an object."));
        }

        if (typeof authenticationProviderConfig.type !== "string") {
            return Result.fail(WebhooksModuleApplicationErrors.invalidAuthenticationProviderConfig("'authenticationProvider.type' must be a string."));
        }

        if (authenticationProviderConfig.type === "OAuth2") {
            const bearerTokenConfig = authenticationProviderConfig as { type: "BearerToken"; accessTokenUrl: string; clientId: string; clientSecret: string; scope?: string };
            if (!bearerTokenConfig.accessTokenUrl || !bearerTokenConfig.clientId || !bearerTokenConfig.clientSecret) {
                return Result.fail(
                    WebhooksModuleApplicationErrors.invalidAuthenticationProviderConfig(
                        "'BearerToken' authentication provider is missing required properties. The object must contain at least 'accessTokenUrl', 'clientId' and 'clientSecret'."
                    )
                );
            }

            return Result.ok(
                new OAuth2AuthenticationProvider(bearerTokenConfig.accessTokenUrl, bearerTokenConfig.clientId, bearerTokenConfig.clientSecret, bearerTokenConfig.scope)
            );
        }

        return Result.fail(WebhooksModuleApplicationErrors.invalidAuthenticationProviderConfig(`Invalid authentication provider type '${authenticationProviderConfig.type}'.`));
    }

    private static parseWebhooks(configJson: WebhooksModuleConfiguration, namedTargets: Record<string, Target | undefined>): Result<Webhook[]> {
        if (!configJson.webhooks) {
            return Result.ok([]);
        }

        const webhooks: Webhook[] = [];

        for (const webhookJson of configJson.webhooks) {
            const result = this.parseWebhook(webhookJson, namedTargets);

            if (result.isError) return Result.fail(result.error);

            webhooks.push(result.value);
        }

        return Result.ok(webhooks);
    }

    private static parseWebhook(webhookJson: WebhooksModuleConfigurationWebhook, namedTargets: Record<string, Target | undefined>): Result<Webhook> {
        let target: Target;

        if (typeof webhookJson.target === "string") {
            const namedTarget = namedTargets[webhookJson.target];

            if (!namedTarget) return Result.fail(WebhooksModuleApplicationErrors.invalidTargetReference(webhookJson.target));

            target = namedTarget;
        } else {
            const targetResult = ConfigParser.createTarget(webhookJson.target.url, webhookJson.target.headers, webhookJson.target.authenticationProvider);
            if (targetResult.isError) return Result.fail(targetResult.error);

            target = targetResult.value;
        }

        const webhookModel = new Webhook(webhookJson.triggers, target);
        return Result.ok(webhookModel);
    }
}
