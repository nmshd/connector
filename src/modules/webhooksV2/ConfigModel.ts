import { Result } from "@js-soft/ts-utils";
import { WebhooksModuleApplicationErrors } from "./WebhooksModuleApplicationErrors";

export class ConfigModel {
    public constructor(public readonly webhooks: WebhookArray) {}
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

export class WebhookArray extends Array<Webhook> {
    public constructor(...webhooks: Webhook[]) {
        super(...webhooks);
    }

    public getWebhooksForTrigger(trigger: string): Webhook[] {
        return this.filter((w) => w.triggers.includes(trigger));
    }

    public getDistinctTriggers(): string[] {
        const triggers: Record<string, boolean> = {};

        for (const webhook of this) {
            for (const trigger of webhook.triggers) {
                triggers[trigger] = true;
            }
        }

        return Object.keys(triggers);
    }
}

export class Webhook {
    public constructor(public readonly triggers: string[], public readonly target: Target) {}
}
