import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { getTimeout } from "./lib/setTimeout";
import { establishRelationship, exchangeMessage, getRelationship, syncUntilHasMessages, uploadFile } from "./lib/testUtils";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;
let connector2Address: string;

beforeAll(async () => {
    [client1, client2] = await launcher.launch(2);
    await establishRelationship(client1, client2);

    const relationship = await getRelationship(client1);
    connector2Address = relationship.peer;
}, getTimeout(30000));

afterAll(() => launcher.stop());

describe("Messaging", () => {
    let fileId: string;
    let messageId: string;

    beforeAll(async () => {
        const file = await uploadFile(client1);
        fileId = file.id;
    });

    test("send a Message from C1 to C2", async () => {
        expect(connector2Address).toBeDefined();
        expect(fileId).toBeDefined();

        const response = await client1.messages.sendMessage({
            recipients: [connector2Address],
            content: {
                "@type": "Mail",
                body: "b",
                cc: [],
                subject: "a",
                to: [connector2Address]
            },
            attachments: [fileId]
        });
        expect(response).toBeSuccessful();

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
            to: [connector2Address]
        });
    });

    test("receive the message on C2 in /Messages", async () => {
        expect(messageId).toBeDefined();

        const response = await client2.messages.getMessages();
        expect(response).toBeSuccessful();
        expect(response.result).toHaveLength(1);

        const message = response.result[0];
        expect(message.id).toStrictEqual(messageId);
        expect(message.content).toStrictEqual({
            "@type": "Mail",
            body: "b",
            cc: [],
            subject: "a",
            to: [connector2Address]
        });
    });

    test("receive the message on C2 in /Messages/{id}", async () => {
        expect(messageId).toBeDefined();

        const response = await client2.messages.getMessage(messageId);
        expect(response).toBeSuccessful();
    });
});

describe("Message errors", () => {
    const fakeAddress = "did:e:localhost:dids:0000000000000000000000";

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
        expect(result).toBeAnError("Mail.to:Array :: may not be empty", "error.runtime.requestDeserialization");
    });

    test("should throw correct error for missing 'to' in the Message", async () => {
        const result = await client1.messages.sendMessage({
            recipients: [fakeAddress],
            content: {
                "@type": "Mail",
                subject: "A Subject",
                body: "A Body"
            } as any
        });
        expect(result).toBeAnError("Mail.to :: Value is not defined", "error.runtime.requestDeserialization");
    });
});

describe("Message query", () => {
    test("query messages", async () => {
        const message = await exchangeMessage(client1, client2);
        const conditions = new QueryParamConditions(message, client2)
            .addDateSet("createdAt")
            .addStringSet("createdBy")
            .addStringSet("recipients.address", message.recipients[0].address)
            .addStringSet("recipients.relationshipId", message.recipients[0].relationshipId)
            .addStringSet("content.@type")
            .addStringSet("content.subject")
            .addStringSet("content.body")
            .addStringSet("createdByDevice")
            .addStringArraySet("attachments")
            .addSingleCondition({
                key: "participant",
                value: [message.createdBy, "id111111111111111111111111111111111"],
                expectedResult: true
            });

        await conditions.executeTests((c, q) => c.messages.getMessages(q));
    });
});
