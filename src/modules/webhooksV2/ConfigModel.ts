import { Result } from "@js-soft/ts-utils";
import { WebhooksModuleApplicationErrors } from "./WebhooksModuleApplicationErrors";

export class ConfigModel {
    public constructor(public readonly webhooks: Webhook[]) {}
}

export class Webhook {
    public constructor(public readonly triggers: string[], public readonly target: Target) {}
}

export class Target {
    public constructor(public readonly urlTemplate: WebhookUrlTemplate, public readonly headers: Record<string, string>) {}
}

export class WebhookUrlTemplate {
    private static readonly PLACEHOLDER_FOR_TRIGGER = "{{trigger}}";

    private constructor(public readonly value: string) {}

    public static fromString(value: string): Result<WebhookUrlTemplate> {
        if (!this.isValidHttpUrl(value)) {
            return Result.fail(WebhooksModuleApplicationErrors.invalidUrlFormat(value));
        }

        return Result.ok(new WebhookUrlTemplate(value));
    }

    public fill(placeholderValues: { trigger: string }): string {
        return this.value.replace(WebhookUrlTemplate.PLACEHOLDER_FOR_TRIGGER, placeholderValues.trigger);
    }

    private static isValidHttpUrl(potentialUrl: string) {
        let url;

        try {
            url = new URL(potentialUrl);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }
}
