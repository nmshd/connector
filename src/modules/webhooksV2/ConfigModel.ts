export class ConfigModel {
    public constructor(public readonly webhooks: WebhookArray) {}
}

export class Target {
    public constructor(public readonly url: string, public readonly headers: Record<string, string>) {}
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
