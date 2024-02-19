import { WebhookUrlTemplate } from "../../../src/modules/webhooks/ConfigModel";

describe("WebhookModel", () => {
    describe("WebhookUrlTemplate", () => {
        test("fillPlaceholders fills placeholders", () => {
            const urlTemplate = WebhookUrlTemplate.fromString("http://a.domain.com/path/{{trigger}}").value;
            const url = urlTemplate.fill({ trigger: "trigger-value" });
            expect(url).toBe("http://a.domain.com/path/trigger-value");
        });
    });
});
