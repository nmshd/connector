import { Result } from "@js-soft/ts-utils";
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

        const configModel = new ConfigModel(webhooks.value);
        return Result.ok(configModel);
    }

    private static parseNamedTargets(configJson: WebhooksModuleConfiguration): Result<Record<string, Target | undefined>> {
        const targets: Record<string, Target | undefined> = {};

        for (const targetName in configJson.targets) {
            const targetJson = configJson.targets[targetName];
            const targetModelResult = ConfigParser.createTarget(targetJson.url, targetJson.headers);
            if (targetModelResult.isError) return Result.fail(targetModelResult.error);

            targets[targetName] = targetModelResult.value;
        }

        return Result.ok(targets);
    }

    private static createTarget(url: string, headers: Record<string, string> | undefined): Result<Target> {
        const urlTemplateResult = WebhookUrlTemplate.fromString(url);
        if (urlTemplateResult.isError) return Result.fail(urlTemplateResult.error);

        const target = new Target(urlTemplateResult.value, headers ?? {});

        return Result.ok(target);
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
            const targetResult = ConfigParser.createTarget(webhookJson.target.url, webhookJson.target.headers);
            if (targetResult.isError) return Result.fail(targetResult.error);

            target = targetResult.value;
        }

        const webhookModel = new Webhook(webhookJson.triggers, target);
        return Result.ok(webhookModel);
    }
}
