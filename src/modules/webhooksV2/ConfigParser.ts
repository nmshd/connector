import { Result } from "@js-soft/ts-utils";
import { ConfigModel, Target, Webhook, WebhookArray } from "./ConfigModel";
import { WebhooksModuleApplicationErrors } from "./WebhooksModuleApplicationErrors";
import { WebhooksModuleConfiguration, WebhooksModuleConfigurationWebhook } from "./WebhooksModuleConfiguration";

export class ConfigParser {
    public static parse(configJson: WebhooksModuleConfiguration): Result<ConfigModel> {
        const namedTargets = ConfigParser.parseNamedTargets(configJson);
        const webhooks = ConfigParser.parseWebhooks(configJson, namedTargets);

        if (webhooks.isError) {
            return Result.fail(webhooks.error);
        }

        const configModel = new ConfigModel(webhooks.value);
        return Result.ok(configModel);
    }

    private static parseNamedTargets(configJson: WebhooksModuleConfiguration) {
        const targets: Record<string, Target | undefined> = {};

        for (const targetName in configJson.targets) {
            const targetJson = configJson.targets[targetName];
            const targetModel = new Target(targetJson.url, targetJson.headers ?? {});
            targets[targetName] = targetModel;
        }

        return targets;
    }

    private static parseWebhooks(configJson: WebhooksModuleConfiguration, namedTargets: Record<string, Target | undefined>): Result<WebhookArray> {
        if (!configJson.webhooks) {
            return Result.ok(new WebhookArray());
        }

        const webhooks = new WebhookArray();

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
            target = new Target(webhookJson.target.url, webhookJson.target.headers ?? {});
        }

        const webhookModel = new Webhook(webhookJson.triggers, target);
        return Result.ok(webhookModel);
    }
}
