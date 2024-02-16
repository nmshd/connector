import { sleep } from "@js-soft/ts-utils";
import {
    ConnectorAttribute,
    ConnectorClient,
    ConnectorFile,
    ConnectorIdentityAttribute,
    ConnectorMessage,
    ConnectorRelationship,
    ConnectorRelationshipAttribute,
    ConnectorRelationshipTemplate,
    ConnectorRequestStatus,
    ConnectorSyncResult,
    ConnectorToken,
    CreateOutgoingRequestRequest,
    CreateRepositoryAttributeRequest,
    UploadOwnFileRequest
} from "@nmshd/connector-sdk";
import fs from "fs";
import { DateTime } from "luxon";
import { Launcher } from "./Launcher";
import { ValidationSchema } from "./validation";
import { getEvents, startEventLog, stopEventLog } from "./webhookServer";

export async function syncUntil(client: ConnectorClient, until: (syncResult: ConnectorSyncResult) => boolean): Promise<ConnectorSyncResult> {
    const syncResponse = await client.account.sync();
    expect(syncResponse).toBeSuccessful(ValidationSchema.ConnectorSyncResult);

    const connectorSyncResult: ConnectorSyncResult = { messages: [...syncResponse.result.messages], relationships: [...syncResponse.result.relationships] };

    let iterationNumber = 0;
    while (!until(connectorSyncResult) && iterationNumber < 25) {
        // incrementally increase sleep duration
        iterationNumber++;
        await sleep(iterationNumber * 50);

        const newSyncResponse = await client.account.sync();
        expect(newSyncResponse).toBeSuccessful(ValidationSchema.ConnectorSyncResult);

        const newConnectorSyncResult = newSyncResponse.result;

        connectorSyncResult.messages.push(...newConnectorSyncResult.messages);
        connectorSyncResult.relationships.push(...newConnectorSyncResult.relationships);
    }

    if (!until(connectorSyncResult)) {
        throw new Error("syncUntil() timed out");
    }

    return connectorSyncResult;
}

export async function syncUntilHasRelationships(client: ConnectorClient, expectedNumberOfRelationships = 1): Promise<ConnectorRelationship[]> {
    const syncResult = await syncUntil(client, (syncResult) => syncResult.relationships.length >= expectedNumberOfRelationships);
    return syncResult.relationships;
}

export async function syncUntilHasMessages(client: ConnectorClient, expectedNumberOfMessages = 1): Promise<ConnectorMessage[]> {
    const syncResult = await syncUntil(client, (syncResult) => syncResult.messages.length >= expectedNumberOfMessages);
    return syncResult.messages;
}

export async function syncUntilHasMessageWithRequest(client: ConnectorClient, requestId: string): Promise<ConnectorMessage> {
    const isRequest = (content: any) => content["@type"] === "Request" && content.id === requestId;
    const filterRequestMessagesByRequestId = (syncResult: ConnectorSyncResult) => {
        return syncResult.messages.filter((m: ConnectorMessage) => isRequest(m.content));
    };

    const name = await new Launcher().randomString();
    startEventLog(name);
    const syncResult = await syncUntil(client, (syncResult) => filterRequestMessagesByRequestId(syncResult).length !== 0);
    let events = getEvents(name);
    while (!events.some((e) => e.trigger === "consumption.messageProcessed" && isRequest(e.data.message?.content))) {
        await sleep(500);
        events = getEvents(name);
    }
    stopEventLog(name);
    return filterRequestMessagesByRequestId(syncResult)[0];
}
export async function syncUntilHasMessageWithNotification(client: ConnectorClient, notificationId: string): Promise<ConnectorMessage> {
    const isNotification = (content: any) => {
        if (!content) {
            return false;
        }
        return content["@type"] === "Notification" && content.id === notificationId;
    };
    const filterRequestMessagesByRequestId = (syncResult: ConnectorSyncResult) => {
        return syncResult.messages.filter((m: ConnectorMessage) => isNotification(m.content));
    };
    const name = await new Launcher().randomString();
    startEventLog(name);
    const syncResult = await syncUntil(client, (syncResult) => filterRequestMessagesByRequestId(syncResult).length !== 0);
    let events = getEvents(name);
    while (!events.some((e) => e.trigger === "consumption.messageProcessed" && isNotification(e.data.message?.content))) {
        await sleep(500);
        events = getEvents(name);
    }
    stopEventLog(name);
    return filterRequestMessagesByRequestId(syncResult)[0];
}

export async function syncUntilHasMessageWithResponse(client: ConnectorClient, requestId: string): Promise<ConnectorMessage> {
    const isResponse = (content: any) => content["@type"] === "ResponseWrapper" && content.requestId === requestId;
    const filterRequestMessagesByRequestId = (syncResult: ConnectorSyncResult) => {
        return syncResult.messages.filter((m: ConnectorMessage) => isResponse(m.content));
    };

    const name = await new Launcher().randomString();
    startEventLog(name);
    const syncResult = await syncUntil(client, (syncResult) => {
        return filterRequestMessagesByRequestId(syncResult).length !== 0;
    });
    let events = getEvents(name);
    while (!events.some((e) => e.trigger === "consumption.messageProcessed" && isResponse(e.data.message?.content))) {
        await sleep(500);
        events = getEvents(name);
    }
    stopEventLog(name);
    return filterRequestMessagesByRequestId(syncResult)[0];
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

export async function makeUploadRequest(values: object = {}): Promise<UploadOwnFileRequest> {
    return {
        title: "File Title",
        filename: "test.txt",
        file: await fs.promises.readFile(`${__dirname}/../__assets__/test.txt`),
        description: "This is a valid file description",
        expiresAt: DateTime.utc().plus({ minutes: 5 }).toString(),
        ...values
    };
}

export async function createTemplate(client: ConnectorClient): Promise<ConnectorRelationshipTemplate> {
    const response = await client.relationshipTemplates.createOwnRelationshipTemplate({
        maxNumberOfAllocations: 1,
        expiresAt: DateTime.utc().plus({ minutes: 10 }).toString(),
        content: { a: "b" }
    });

    expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);

    return response.result;
}

export async function getTemplateToken(client: ConnectorClient): Promise<ConnectorToken> {
    const template = await createTemplate(client);

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

export async function exchangeTemplate(clientCreator: ConnectorClient, clientRecpipient: ConnectorClient): Promise<ConnectorRelationshipTemplate> {
    const templateToken = await getTemplateToken(clientCreator);

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

    const createRelationshipResponse = await client2.relationships.createRelationship({ templateId: template.id, content: { a: "b" } });
    expect(createRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);

    const relationships = await syncUntilHasRelationships(client1);
    expect(relationships).toHaveLength(1);

    const acceptResponse = await client1.relationships.acceptRelationshipChange(relationships[0].id, relationships[0].changes[0].id, { content: { a: "b" } });
    expect(acceptResponse).toBeSuccessful(ValidationSchema.Relationship);

    const relationships2 = await syncUntilHasRelationships(client2);
    expect(relationships2).toHaveLength(1);
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
    sender: ConnectorClient,
    recipient: ConnectorClient,
    attributeContent: Omit<ConnectorRelationshipAttribute, "owner" | "@type">
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

    await syncUntilHasMessageWithRequest(recipient, requestId);
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
    attributeContent: ConnectorIdentityAttribute
): Promise<ConnectorAttribute> {
    const recipientIdentityInfoResult = await recipient.account.getIdentityInfo();
    expect(recipientIdentityInfoResult.isSuccess).toBe(true);
    const recipientAddress = recipientIdentityInfoResult.result.address;

    const createAttributeRequestResult = await sender.attributes.createRepositoryAttribute({ content: { value: attributeContent.value } });
    const attribute = createAttributeRequestResult.result;

    const shareAttributeRequest: CreateOutgoingRequestRequest = {
        peer: recipientAddress,
        content: {
            items: [
                {
                    "@type": "ShareAttributeRequestItem",
                    mustBeAccepted: true,
                    sourceAttributeId: attribute.id,
                    attribute: attributeContent
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
    await syncUntilHasMessageWithRequest(recipient, requestId);

    let recipientRequest = (await recipient.incomingRequests.getRequest(requestId)).result;
    while (recipientRequest.status !== ConnectorRequestStatus.ManualDecisionRequired) {
        await sleep(500);
        recipientRequest = (await recipient.incomingRequests.getRequest(requestId)).result;
    }

    await recipient.incomingRequests.accept(requestId, { items: [{ accept: true }] });

    const responseMessage = await syncUntilHasMessageWithResponse(sender, requestId);
    const sharedAttributeId = (responseMessage as any).content.response.items[0].attributeId;

    const senderOwnSharedIdentityAttribute = (await sender.attributes.getAttribute(sharedAttributeId)).result;
    return senderOwnSharedIdentityAttribute;
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
