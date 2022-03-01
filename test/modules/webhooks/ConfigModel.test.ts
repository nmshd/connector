import { Target, Webhook, WebhookArray } from "../../../src/modules/webhooksV2/ConfigModel";

describe("WebhookModels", () => {
    test("getWebhooksForTrigger only returns webhooks with given trigger", () => {
        const webhooks = new WebhookArray();
        const target = new Target("http://a.domain.com/path/", {});
        webhooks.push(new Webhook(["trigger1"], target));
        webhooks.push(new Webhook(["trigger2"], target));
        webhooks.push(new Webhook(["trigger1"], target));

        const webhooksForTrigger = webhooks.getWebhooksForTrigger("trigger1");

        expect(webhooksForTrigger).toHaveLength(2);
    });

    test("getWebhooksForTrigger returns empty array when no webhooks where found for trigger", () => {
        const webhooks = new WebhookArray();
        const target = new Target("http://a.domain.com/path/", {});
        webhooks.push(new Webhook(["trigger1"], target));

        const webhooksForTrigger = webhooks.getWebhooksForTrigger("non-existent-trigger");

        expect(webhooksForTrigger).toBeDefined();
        expect(webhooksForTrigger).toHaveLength(0);
    });

    test("getWebhooksForTrigger works with empty webhooks array", () => {
        const webhooks = new WebhookArray();

        const webhooksForTrigger = webhooks.getWebhooksForTrigger("non-existent-trigger");

        expect(webhooksForTrigger).toBeDefined();
        expect(webhooksForTrigger).toHaveLength(0);
    });

    test("getDistinctTriggers returns each trigger once", () => {
        const webhooks = new WebhookArray();
        const target = new Target("http://a.domain.com/path/", {});
        webhooks.push(new Webhook(["trigger1", "trigger2"], target));
        webhooks.push(new Webhook(["trigger2"], target));
        webhooks.push(new Webhook(["trigger1"], target));

        const distinctTriggers = webhooks.getDistinctTriggers();

        expect(distinctTriggers).toHaveLength(2);
        expect(distinctTriggers).toContain("trigger1");
        expect(distinctTriggers).toContain("trigger2");
    });
});
