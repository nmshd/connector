import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { establishRelationship, exchangeMessage, getRelationship, syncUntilHasMessages, uploadFile } from "./lib/testUtils";
import { expectError, expectSuccess, ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;
let bc2Address: string;

beforeAll(async () => {
    [client1, client2] = await launcher.launch(2);
    await establishRelationship(client1, client2);

    const relationship = await getRelationship(client1);
    bc2Address = relationship.peer;
}, 30000);

afterAll(() => launcher.stop());

describe("Messaging", () => {
    let fileId: string;
    let messageId: string;

    beforeAll(async () => {
        const file = await uploadFile(client1);
        fileId = file.id;
    });

    test("send a Message from BC1 to BC2", async () => {
        expect(bc2Address).toBeDefined();
        expect(fileId).toBeDefined();

        const response = await client1.messages.sendMessage({
            recipients: [bc2Address],
            content: {
                "@type": "Mail",
                body: "b",
                cc: [],
                subject: "a",
                to: [bc2Address]
            },
            attachments: [fileId]
        });
        expectSuccess(response, ValidationSchema.Message);

        messageId = response.result.id;
    });

    test("receive the message in sync", async () => {
        expect(messageId).toBeDefined();

        const messages = await syncUntilHasMessages(client2);
        expect(messages).toHaveLength(1);

        const message = messages[0];
        expect(message.id).toStrictEqual(messageId);
        expect(message.content).toStrictEqual({
            "@type": "Mail",
            body: "b",
            cc: [],
            subject: "a",
            to: [bc2Address]
        });
    });

    test("receive the message on BC2 in /Messages", async () => {
        expect(messageId).toBeDefined();

        const response = await client2.messages.getMessages();
        expectSuccess(response, ValidationSchema.Messages);
        expect(response.result).toHaveLength(1);

        const message = response.result[0];
        expect(message.id).toStrictEqual(messageId);
        expect(message.content).toStrictEqual({
            "@type": "Mail",
            body: "b",
            cc: [],
            subject: "a",
            to: [bc2Address]
        });
    });

    test("receive the message on BC2 in /Messages/{id}", async () => {
        expect(messageId).toBeDefined();

        const response = await client2.messages.getMessage(messageId);
        expectSuccess(response, ValidationSchema.MessageWithAttachments);
    });
});

describe("Message errors", () => {
    const fakeAddress = "id1PNvUP4jHD74qo6usnWNoaFGFf33MXZi6c";
    test("should throw correct error for empty 'to' in the Message", async () => {
        const result = await client1.messages.sendMessage({
            recipients: [fakeAddress],
            content: {
                "@type": "Mail",
                to: [],
                subject: "A Subject",
                body: "A Body"
            }
        });
        expectError(result, "Mail.to:Array :: may not be empty", "error.runtime.requestDeserialization");
    });

    test("should throw correct error for missing 'to' in the Message", async () => {
        const result = await client1.messages.sendMessage({
            recipients: [fakeAddress],
            content: {
                "@type": "Mail",
                subject: "A Subject",
                body: "A Body"
            }
        });
        expectError(result, "Mail.to :: Value is not defined", "error.runtime.requestDeserialization");
    });
});

describe("Message query", () => {
    test("query messages", async () => {
        const message = await exchangeMessage(client1, client2);
        const conditions = new QueryParamConditions(message, client1)
            .addDateSet("createdAt")
            .addDateSet("lastMessageSentAt")
            .addStringSet("createdBy")
            .addStringSet("recipients.address", message.recipients[0].address)
            .addStringSet("content.@type")
            .addStringSet("content.subject")
            .addStringSet("content.body")
            .addStringSet("createdByDevice")
            .addStringArraySet("attachments")
            .addStringArraySet("relationshipIds")
            .addSingleCondition({
                key: "participant",
                value: [message.createdBy, "id111111111111111111111111111111111"],
                expectedResult: true
            });

        await conditions.executeTests((c, q) => c.messages.getMessages(q), ValidationSchema.Messages);
    });
});
