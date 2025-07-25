import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { getTimeout } from "./lib/setTimeout";
import { establishRelationship } from "./lib/testUtils";

const launcher = new Launcher();
let sender: ConnectorClient;
let recipient: ConnectorClient;

beforeAll(async () => {
    [sender, recipient] = await launcher.launch(2);

    await establishRelationship(sender, recipient);
}, getTimeout(30000));
afterAll(() => launcher.stop());

describe("Backbone Notifications Endpoints", () => {
    test("can send a BackboneNotification", async () => {
        const recipientAddress = (await recipient.account.getIdentityInfo()).result.address;

        const identityInfo = await sender.backboneNotifications.sendBackboneNotification({ recipients: [recipientAddress], code: "TestCode" });
        expect(identityInfo).toBeSuccessfulVoidResult();
    });

    test("can not send a BackboneNotification to an invalid recipient", async () => {
        const identityInfo = await sender.backboneNotifications.sendBackboneNotification({ recipients: ["did:e:localhost:dids:0000000000000000000000"], code: "TestCode" });
        expect(identityInfo).toBeAnError(/.*/, "error.transport.backboneNotifications.noActiveRelationshipFoundForRecipients");
    });

    test("can not send a BackboneNotification with an invalid code", async () => {
        const recipientAddress = (await recipient.account.getIdentityInfo()).result.address;

        const identityInfo = await sender.backboneNotifications.sendBackboneNotification({ recipients: [recipientAddress], code: "anInvalidCode" });
        expect(identityInfo).toBeAnError(/.*/, "error.platform.validation.notification.codeDoesNotExist");
    });
});
