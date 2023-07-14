import { sleep } from "@js-soft/ts-utils";
import {
    ConnectorAttribute,
    ConnectorClient,
    ConnectorFile,
    ConnectorMessage,
    ConnectorRelationship,
    ConnectorRelationshipTemplate,
    ConnectorSyncResult,
    ConnectorToken,
    CreateAttributeRequest,
    UploadOwnFileRequest
} from "@nmshd/connector-sdk";
import fs from "fs";
import { DateTime } from "luxon";
import { ValidationSchema } from "./validation";

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

export async function createAttribute(client: ConnectorClient, request: CreateAttributeRequest): Promise<ConnectorAttribute> {
    const response = await client.attributes.createAttribute(request);
    expect(response).toBeSuccessful(ValidationSchema.ConnectorAttribute);

    return response.result;
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
