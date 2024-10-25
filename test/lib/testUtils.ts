import { MongoDbConnection } from "@js-soft/docdb-access-mongo";
import { DataEvent, EventBus, SubscriptionTarget, sleep } from "@js-soft/ts-utils";
import {
    ConnectorAttribute,
    ConnectorClient,
    ConnectorFile,
    ConnectorMessage,
    ConnectorRelationship,
    ConnectorRelationshipTemplate,
    ConnectorRequest,
    ConnectorRequestStatus,
    ConnectorToken,
    CreateOutgoingRequestRequest,
    CreateRepositoryAttributeRequest,
    UploadOwnFileRequest
} from "@nmshd/connector-sdk";
import { AttributeValues, RelationshipAttributeJSON } from "@nmshd/content";
import fs from "fs";
import { DateTime } from "luxon";
import { ConnectorClientWithMetadata } from "./Launcher";
import { ValidationSchema } from "./validation";

export interface MessageProcessedEventData {
    message: ConnectorMessage;
    result: "ManualRequestDecisionRequired" | "NoRequest" | "Error";
}

export async function connectAndEmptyCollection(databaseName: string, collectionName: string): Promise<void> {
    const connection = new MongoDbConnection(process.env.DATABASE_CONNECTION_STRING!);
    try {
        await connection.connect();

        const database = await connection.getDatabase(databaseName);
        const collection = await database.getCollection(collectionName);
        await collection.delete({});
    } finally {
        await connection.close();
    }
}

export async function syncUntil(client: ConnectorClientWithMetadata, until: (client: ConnectorClientWithMetadata) => boolean): Promise<void> {
    client._eventBus!.reset();
    let iterationNumber = 0;
    while (!until(client) && iterationNumber < 25) {
        // incrementally increase sleep duration
        await sleep(iterationNumber * 50);
        iterationNumber++;

        const newSyncResponse = await client.account.sync();
        expect(newSyncResponse.isSuccess).toBe(true);
    }

    if (!until(client)) {
        throw new Error("syncUntil() timed out");
    }
}

export async function syncUntilHasRelationship(client: ConnectorClientWithMetadata, relationshipId: string): Promise<ConnectorRelationship> {
    await syncUntil(
        client,
        (client) =>
            client._eventBus!.publishedEvents.filter(
                (e) =>
                    ["transport.relationshipChanged", "transport.relationshipReactivationCompleted", "transport.relationshipReactivationRequested"].includes(e.namespace) &&
                    (e as DataEvent<ConnectorRelationship>).data.id === relationshipId
            ).length >= 1
    );
    return (
        client
            ._eventBus!.publishedEvents.filter(
                (e) =>
                    ["transport.relationshipChanged", "transport.relationshipReactivationCompleted", "transport.relationshipReactivationRequested"].includes(e.namespace) &&
                    (e as DataEvent<ConnectorRelationship>).data.id === relationshipId
            )
            .at(-1) as DataEvent<ConnectorRelationship>
    ).data;
}

export async function syncUntilHasMessages(client: ConnectorClientWithMetadata, expectedNumberOfMessages = 1): Promise<ConnectorMessage[]> {
    await syncUntil(client, (client) => client._eventBus!.publishedEvents.filter((e) => e.namespace === "transport.messageReceived").length >= expectedNumberOfMessages);
    return client._eventBus!.publishedEvents.filter((e) => e.namespace === "transport.messageReceived").map((e) => (e as DataEvent<ConnectorMessage>).data);
}

export async function syncUntilHasRequest(client: ConnectorClientWithMetadata, requestId: string): Promise<ConnectorRequest> {
    await syncUntil(
        client,
        (client) =>
            client._eventBus!.publishedEvents.filter((e) => e.namespace === "consumption.incomingRequestReceived" && (e as DataEvent<ConnectorRequest>).data.id === requestId)
                .length === 1
    );

    return (
        client._eventBus!.publishedEvents.filter(
            (e) => e.namespace === "consumption.incomingRequestReceived" && (e as DataEvent<ConnectorRequest>).data.id === requestId
        )[0] as DataEvent<ConnectorRequest>
    ).data;
}

export async function syncUntilHasMessageWithNotification(client: ConnectorClientWithMetadata, notificationId: string): Promise<ConnectorMessage> {
    const isNotification = (content: any) => {
        if (!content) return false;

        return content["@type"] === "Notification" && content.id === notificationId;
    };

    await syncUntil(
        client,
        (client) =>
            client._eventBus!.publishedEvents.filter(
                (e) => e.namespace === "consumption.messageProcessed" && isNotification((e as DataEvent<MessageProcessedEventData>).data.message.content)
            ).length === 1
    );

    return (
        client._eventBus!.publishedEvents.filter(
            (e) => e.namespace === "consumption.messageProcessed" && isNotification((e as DataEvent<MessageProcessedEventData>).data.message.content)
        )[0] as DataEvent<MessageProcessedEventData>
    ).data.message;
}

export async function syncUntilHasMessageWithResponse(client: ConnectorClientWithMetadata, requestId: string): Promise<ConnectorMessage> {
    const isResponse = (content: any) => {
        if (!content) return false;

        return content["@type"] === "ResponseWrapper" && content.requestId === requestId;
    };
    await syncUntil(
        client,
        (client) =>
            client._eventBus!.publishedEvents.filter(
                (e) => e.namespace === "consumption.messageProcessed" && isResponse((e as DataEvent<MessageProcessedEventData>).data.message.content)
            ).length === 1
    );

    return (
        client._eventBus!.publishedEvents.filter(
            (e) => e.namespace === "consumption.messageProcessed" && isResponse((e as DataEvent<MessageProcessedEventData>).data.message.content)
        )[0] as DataEvent<MessageProcessedEventData>
    ).data.message;
}

export async function uploadOwnToken(client: ConnectorClient): Promise<ConnectorToken> {
    const response = await client.tokens.createOwnToken({
        content: {
            content: "Hello"
        },
        expiresAt: DateTime.utc().plus({ days: 1 }).toString()
    });

    expect(response).toBeSuccessful(ValidationSchema.Token);

    return response.result;
}

export async function uploadPeerToken(client: ConnectorClient, reference: string): Promise<ConnectorToken> {
    const response = await client.tokens.loadPeerToken({ reference });

    expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);

    return response.result;
}

export async function uploadFile(client: ConnectorClient): Promise<ConnectorFile> {
    const response = await client.files.uploadOwnFile(await makeUploadRequest());

    expect(response).toBeSuccessful(ValidationSchema.File);

    return response.result;
}

export async function makeUploadRequest(values: Partial<UploadOwnFileRequest> = {}): Promise<UploadOwnFileRequest> {
    return {
        title: "File Title",
        filename: "test.txt",
        file: await fs.promises.readFile(`${__dirname}/../__assets__/test.txt`),
        description: "This is a valid file description",
        expiresAt: DateTime.utc().plus({ minutes: 5 }).toString(),
        ...values
    };
}

export async function createTemplate(client: ConnectorClient, forIdentity?: string): Promise<ConnectorRelationshipTemplate> {
    const response = await client.relationshipTemplates.createOwnRelationshipTemplate({
        maxNumberOfAllocations: 1,
        expiresAt: DateTime.utc().plus({ minutes: 10 }).toString(),
        content: {
            "@type": "ArbitraryRelationshipTemplateContent",
            value: { a: "b" }
        },
        forIdentity
    });

    expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);

    return response.result;
}

export async function getTemplateToken(client: ConnectorClient, tempateForIdentity?: string): Promise<ConnectorToken> {
    const template = await createTemplate(client, tempateForIdentity);

    const response = await client.relationshipTemplates.createTokenForOwnRelationshipTemplate(template.id);
    expect(response).toBeSuccessful(ValidationSchema.Token);

    return response.result;
}

export async function getFileToken(client: ConnectorClient): Promise<ConnectorToken> {
    const file = await uploadFile(client);

    const response = await client.files.createTokenForFile(file.id);
    expect(response).toBeSuccessful(ValidationSchema.Token);

    return response.result;
}

export async function exchangeTemplate(clientCreator: ConnectorClient, clientRecpipient: ConnectorClient, forIdentity?: string): Promise<ConnectorRelationshipTemplate> {
    const templateToken = await getTemplateToken(clientCreator, forIdentity);

    const response = await clientRecpipient.relationshipTemplates.loadPeerRelationshipTemplate({
        reference: templateToken.truncatedReference
    });
    expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);

    return response.result;
}

export async function exchangeFile(clientCreator: ConnectorClient, clientRecpipient: ConnectorClient): Promise<ConnectorFile> {
    const fileToken = await getFileToken(clientCreator);

    const response = await clientRecpipient.files.loadPeerFile({ reference: fileToken.truncatedReference });
    expect(response).toBeSuccessful(ValidationSchema.File);

    return response.result;
}

export async function exchangeToken(clientCreator: ConnectorClient, clientRecpipient: ConnectorClient): Promise<ConnectorToken> {
    const token = await uploadOwnToken(clientCreator);

    const response = await clientRecpipient.tokens.loadPeerToken({ reference: token.truncatedReference });
    expect(response).toBeSuccessful(ValidationSchema.Token);

    return response.result;
}

export async function sendMessage(client: ConnectorClient, recipient: string): Promise<ConnectorMessage> {
    const response = await client.messages.sendMessage({
        recipients: [recipient],
        content: {
            "@type": "Mail",
            subject: "This is the mail subject",
            body: "This is the mail body",
            cc: [],
            to: [recipient]
        }
    });
    expect(response).toBeSuccessful(ValidationSchema.Message);

    return response.result;
}

export async function exchangeMessage(sender: ConnectorClient, recipient: ConnectorClient): Promise<ConnectorMessage> {
    const recipientAddress = (await getRelationship(sender)).peer;
    const messageId = (await sendMessage(sender, recipientAddress)).id;
    const messages = await syncUntilHasMessages(recipient);
    expect(messages).toHaveLength(1);

    const message = messages[0];
    expect(message.id).toStrictEqual(messageId);

    return message;
}

export async function getMessageInMessages(client: ConnectorClient, messageId: string): Promise<ConnectorMessage> {
    const response = await client.messages.getMessages();
    expect(response).toBeSuccessful(ValidationSchema.Messages);

    return response.result.find((m) => m.id === messageId)!;
}

export async function getRelationship(client: ConnectorClient): Promise<ConnectorRelationship> {
    const response = await client.relationships.getRelationships();

    expect(response).toBeSuccessful(ValidationSchema.Relationships);
    expect(response.result).toHaveLength(1);

    return response.result[0];
}

export async function establishRelationship(client1: ConnectorClient, client2: ConnectorClient): Promise<void> {
    const template = await exchangeTemplate(client1, client2);

    const createRelationshipResponse = await client2.relationships.createRelationship({
        templateId: template.id,
        creationContent: { "@type": "ArbitraryRelationshipCreationContent", value: {} }
    });
    expect(createRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);

    const relationship = await syncUntilHasRelationship(client1, createRelationshipResponse.result.id);

    const acceptResponse = await client1.relationships.acceptRelationship(relationship.id);
    expect(acceptResponse).toBeSuccessful(ValidationSchema.Relationship);

    await syncUntilHasRelationship(client2, acceptResponse.result.id);
}

export async function createRepositoryAttribute(client: ConnectorClient, request: CreateRepositoryAttributeRequest): Promise<ConnectorAttribute> {
    const response = await client.attributes.createRepositoryAttribute(request);
    expect(response).toBeSuccessful(ValidationSchema.ConnectorAttribute);
    return response.result;
}

/**
 * Creates and shares a relationship attribute, waiting for all communication
 * and event processing to finish. Expects an established relationship.
 *
 * Returns the sender's own shared relationship attribute.
 */
export async function executeFullCreateAndShareRelationshipAttributeFlow(
    sender: ConnectorClientWithMetadata,
    recipient: ConnectorClientWithMetadata,
    attributeContent: Omit<RelationshipAttributeJSON, "owner" | "@type">
): Promise<ConnectorAttribute> {
    const senderIdentityInfoResult = await sender.account.getIdentityInfo();
    expect(senderIdentityInfoResult.isSuccess).toBe(true);
    const senderAddress = senderIdentityInfoResult.result.address;

    const recipientIdentityInfoResult = await recipient.account.getIdentityInfo();
    expect(recipientIdentityInfoResult.isSuccess).toBe(true);
    const recipientAddress = recipientIdentityInfoResult.result.address;

    const request = await sender.outgoingRequests.createRequest({
        peer: recipientAddress,
        content: {
            items: [
                {
                    "@type": "CreateAttributeRequestItem",
                    mustBeAccepted: true,
                    attribute: { ...attributeContent, owner: senderAddress, "@type": "RelationshipAttribute" }
                }
            ]
        }
    });

    const sendMessageResponse = await sender.messages.sendMessage({
        recipients: [recipientAddress],
        content: request.result.content
    });
    const requestId = (sendMessageResponse.result.content as any).id;

    await syncUntilHasRequest(recipient, requestId);
    let recipientRequest = (await recipient.incomingRequests.getRequest(requestId)).result;
    while (recipientRequest.status !== ConnectorRequestStatus.ManualDecisionRequired) {
        await sleep(500);
        recipientRequest = (await recipient.incomingRequests.getRequest(requestId)).result;
    }

    await recipient.incomingRequests.accept(requestId, { items: [{ accept: true }] });

    const responseMessage = await syncUntilHasMessageWithResponse(sender, requestId);
    const sharedAttributeId = (responseMessage.content as any).response.items[0].attributeId;
    const senderRequest = (await sender.outgoingRequests.getRequest(requestId)).result;
    while (senderRequest.status !== ConnectorRequestStatus.Completed) {
        await sleep(500);
    }

    const senderOwnSharedRelationshipAttribute = (await sender.attributes.getAttribute(sharedAttributeId)).result;
    return senderOwnSharedRelationshipAttribute;
}

/**
 * Creates a repository attribute on sender's side and shares it with
 * recipient, waiting for all communication and event processing to finish.
 * Expects an established relationship.
 *
 * Returns the sender's own shared identity attribute.
 */
export async function executeFullCreateAndShareRepositoryAttributeFlow(
    sender: ConnectorClient,
    recipient: ConnectorClient,
    attributeValue: AttributeValues.Identity.Json
): Promise<ConnectorAttribute>;
export async function executeFullCreateAndShareRepositoryAttributeFlow(
    sender: ConnectorClient,
    recipient: ConnectorClient[],
    attributeValue: AttributeValues.Identity.Json
): Promise<ConnectorAttribute[]>;
export async function executeFullCreateAndShareRepositoryAttributeFlow(
    sender: ConnectorClient,
    recipients: ConnectorClient | ConnectorClient[],
    attributeValue: AttributeValues.Identity.Json
): Promise<ConnectorAttribute | ConnectorAttribute[]> {
    const createAttributeRequestResult = await sender.attributes.createRepositoryAttribute({ content: { value: attributeValue } });
    const attribute = createAttributeRequestResult.result;

    if (!Array.isArray(recipients)) {
        recipients = [recipients];
    }

    const results: ConnectorAttribute[] = [];

    for (const recipient of recipients) {
        const recipientIdentityInfoResult = await recipient.account.getIdentityInfo();
        expect(recipientIdentityInfoResult.isSuccess).toBe(true);
        const recipientAddress = recipientIdentityInfoResult.result.address;

        const shareAttributeRequest: CreateOutgoingRequestRequest = {
            peer: recipientAddress,
            content: {
                items: [
                    {
                        "@type": "ShareAttributeRequestItem",
                        mustBeAccepted: true,
                        sourceAttributeId: attribute.id,
                        attribute: attribute.content
                    }
                ]
            }
        };

        const createRequestResult = await sender.outgoingRequests.createRequest(shareAttributeRequest);

        const sendMessageResponse = await sender.messages.sendMessage({
            recipients: [recipientAddress],
            content: createRequestResult.result.content
        });

        const requestId = (sendMessageResponse.result.content as any).id;
        await syncUntilHasRequest(recipient, requestId);

        let recipientRequest = (await recipient.incomingRequests.getRequest(requestId)).result;
        while (recipientRequest.status !== ConnectorRequestStatus.ManualDecisionRequired) {
            await sleep(500);
            recipientRequest = (await recipient.incomingRequests.getRequest(requestId)).result;
        }

        await recipient.incomingRequests.accept(requestId, { items: [{ accept: true }] });

        const responseMessage = await syncUntilHasMessageWithResponse(sender, requestId);
        const sharedAttributeId = (responseMessage as any).content.response.items[0].attributeId;

        const senderOwnSharedIdentityAttribute = (await sender.attributes.getAttribute(sharedAttributeId)).result;
        results.push(senderOwnSharedIdentityAttribute);
    }

    return results.length === 1 ? results[0] : results;
}

/**
 * Generate all possible combinations of the given arrays.
 *
 * combinations([1, 2], [a, b]) => [[1, a], [1, b], [2, a], [2, b]]
 *
 * Special Case: If only one array is given, it returns a list of lists with only the elements of the array
 *
 * combinations([1, 2]) => [[1], [2]]
 *
 * Strictly speaking this is not correct, since the combinations of an array with nothing should be nothing []
 * but in our case this makes more sense
 *
 * Beware: this contains recursion
 */
export function combinations<T>(...arrays: T[][]): T[][] {
    if (arrays.length < 1) {
        throw new Error("you must enter at least one array");
    }

    const firstArray = arrays[0];
    if (arrays.length === 1) {
        // Wrap every element in a list
        // This is neccessary because we want to return [[1], [2]] and not [[1, 2]] or [1, 2]
        return firstArray.map((x) => [x]);
    }

    const [firstArr, secondArr, ...allOtherArrs] = arrays;

    const result = [];
    // Combine the elements of the first array with all combinations of the other arrays
    for (const elem of firstArr) {
        for (const combination of combinations(secondArr, ...allOtherArrs)) {
            result.push([elem, ...combination]);
        }
    }

    return result;
}

export async function waitForEvent<TEvent>(
    eventBus: EventBus,
    subscriptionTarget: SubscriptionTarget<TEvent>,
    assertionFunction?: (t: TEvent) => boolean,
    timeout = 5000
): Promise<TEvent> {
    let subscriptionId: number;

    const eventPromise = new Promise<TEvent>((resolve) => {
        subscriptionId = eventBus.subscribe(subscriptionTarget, (event: TEvent) => {
            if (assertionFunction && !assertionFunction(event)) return;

            resolve(event);
        });
    });
    if (!timeout) return await eventPromise.finally(() => eventBus.unsubscribe(subscriptionId));

    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<TEvent>((_resolve, reject) => {
        timeoutId = setTimeout(
            () => reject(new Error(`timeout exceeded for waiting for event ${typeof subscriptionTarget === "string" ? subscriptionTarget : subscriptionTarget.name}`)),
            timeout
        );
    });

    return await Promise.race([eventPromise, timeoutPromise]).finally(() => {
        eventBus.unsubscribe(subscriptionId);
        clearTimeout(timeoutId);
    });
}
