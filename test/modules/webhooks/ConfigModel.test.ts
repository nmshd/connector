import { Target, Webhook, WebhookArray, WebhookUrlTemplate } from "../../../src/modules/webhooksV2/ConfigModel";

describe("WebhookModel", () => {
    test("getWebhooksForTrigger only returns webhooks with given trigger", () => {
        const webhooks = new WebhookArray();
        const target = new Target(WebhookUrlTemplate.fromString("http://a.domain.com/path/").value, {});
        webhooks.push(new Webhook(["trigger1"], target));
        webhooks.push(new Webhook(["trigger2"], target));
        webhooks.push(new Webhook(["trigger1"], target));

        const webhooksForTrigger = webhooks.getWebhooksForTrigger("trigger1");

        expect(webhooksForTrigger).toHaveLength(2);
    });

    test("getWebhooksForTrigger returns empty array when no webhooks where found for trigger", () => {
        const webhooks = new WebhookArray();
        const target = new Target(WebhookUrlTemplate.fromString("http://a.domain.com/path/").value, {});
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
        const target = new Target(WebhookUrlTemplate.fromString("http://a.domain.com/path/").value, {});
        webhooks.push(new Webhook(["trigger1", "trigger2"], target));
        webhooks.push(new Webhook(["trigger2"], target));
        webhooks.push(new Webhook(["trigger1"], target));

        const distinctTriggers = webhooks.getDistinctTriggers();

        expect(distinctTriggers).toHaveLength(2);
        expect(distinctTriggers).toContain("trigger1");
        expect(distinctTriggers).toContain("trigger2");
    });

    describe("WebhookUrlTemplate", () => {
        test("fillPlaceholders fills placeholders", () => {
            const urlTemplate = WebhookUrlTemplate.fromString("http://a.domain.com/path/{{trigger}}").value;
            const url = urlTemplate.fill({ trigger: "trigger-value" });
            expect(url).toBe("http://a.domain.com/path/trigger-value");
        });
    });
});
