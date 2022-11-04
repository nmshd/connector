import { ConfigParser } from "../../../src/modules/webhooksV2/ConfigParser";
import { WebhooksModuleConfiguration } from "../../../src/modules/webhooksV2/WebhooksModuleConfiguration";

describe("ConfigParser", () => {
    test("parses webhooks with inline targets", () => {
        const config: WebhooksModuleConfiguration = {
            name: "webhooksModule",
            displayName: "A display name",
            enabled: true,
            location: "a/location",

            webhooks: [
                {
                    triggers: ["a-trigger"],
                    target: {
                        url: "http://a.domain.com/path/",
                        headers: {
                            aHeader: "A header value"
                        }
                    }
                }
            ]
        };

        const configModel = ConfigParser.parse(config).value;

        expect(configModel.webhooks).toHaveLength(1);
        expect(configModel.webhooks[0].triggers).toStrictEqual(["a-trigger"]);
        expect(configModel.webhooks[0].target.urlTemplate.value).toBe("http://a.domain.com/path/");
        expect(configModel.webhooks[0].target.headers["aHeader"]).toBe("A header value");
    });

    test("parses webhooks with references to predefined targets", () => {
        const config: WebhooksModuleConfiguration = {
            name: "webhooksModule",
            displayName: "A display name",
            enabled: true,
            location: "a/location",

            targets: {
                default: {
                    url: "http://a.domain.com/path/",
                    headers: {
                        aHeader: "A header value"
                    }
                }
            },
            webhooks: [
                {
                    triggers: ["a-trigger"],
                    target: "default"
                }
            ]
        };

        const configModel = ConfigParser.parse(config).value;

        expect(configModel.webhooks).toHaveLength(1);
        expect(configModel.webhooks[0].triggers).toStrictEqual(["a-trigger"]);
        expect(configModel.webhooks[0].target.urlTemplate.value).toBe("http://a.domain.com/path/");
        expect(configModel.webhooks[0].target.headers["aHeader"]).toBe("A header value");
    });

    test("returns an error when a referenced target does not exist", () => {
        const config: WebhooksModuleConfiguration = {
            name: "webhooksModule",
            displayName: "A display name",
            enabled: true,
            location: "a/location",

            webhooks: [
                {
                    triggers: ["a-trigger"],
                    target: "non-existent-target"
                }
            ]
        };

        const parseResult = ConfigParser.parse(config);

        expect(parseResult.isError).toBeTruthy();
        expect(parseResult.error.code).toBe("error.runtime.modules.webhooksV2.invalidTargetReference");
    });

    test("returns an error when an inline target has an invalid url", () => {
        const config: WebhooksModuleConfiguration = {
            name: "webhooksModule",
            displayName: "A display name",
            enabled: true,
            location: "a/location",

            webhooks: [
                {
                    triggers: ["a-trigger"],
                    target: {
                        url: "this.is.an.invalid.url"
                    }
                }
            ]
        };

        const parseResult = ConfigParser.parse(config);

        expect(parseResult.isError).toBeTruthy();
        expect(parseResult.error.code).toBe("error.runtime.modules.webhooksV2.invalidUrlFormat");
    });

    test("returns an error when a named target has an invalid url", () => {
        const config: WebhooksModuleConfiguration = {
            name: "webhooksModule",
            displayName: "A display name",
            enabled: true,
            location: "a/location",

            targets: {
                default: {
                    url: "this.is.an.invalid.url"
                }
            },
            webhooks: [
                {
                    triggers: ["a-trigger"],
                    target: "default"
                }
            ]
        };

        const parseResult = ConfigParser.parse(config);

        expect(parseResult.isError).toBeTruthy();
        expect(parseResult.error.code).toBe("error.runtime.modules.webhooksV2.invalidUrlFormat");
    });
});
