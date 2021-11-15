import { ConnectorResponse, getJSONSchemaDefinition } from "@nmshd/connector-sdk";
import { matchersWithOptions } from "jest-json-schema";

expect.extend(
    matchersWithOptions({
        schemas: [getJSONSchemaDefinition()]
    })
);

export enum ValidationSchema {
    Error = "ConnectorError",
    File = "ConnectorFile",
    Files = "ConnectorFiles",
    Message = "ConnectorMessage",
    Messages = "ConnectorMessages",
    MessageWithAttachments = "ConnectorMessageWithAttachments",
    MessagesWithAttachments = "ConnectorMessagesWithAttachments",
    Relationship = "ConnectorRelationship",
    Relationships = "ConnectorRelationships",
    RelationshipTemplate = "ConnectorRelationshipTemplate",
    RelationshipTemplates = "ConnectorRelationshipTemplates",
    Token = "ConnectorToken",
    Tokens = "ConnectorTokens",
    IdentityInfo = "IdentityInfo",
    ConnectorSyncResult = "ConnectorSyncResult",
    ConnectorHealth = "ConnectorHealth",
    ConnectorVersionInfo = "ConnectorVersionInfo",
    ConnectorRequestCount = "ConnectorRequestCount",
    ConnectorSupportInformation = "ConnectorSupportInformation",
    ConnectorSyncInfo = "ConnectorSyncInfo"
}

export function validateSchema(schemaName: ValidationSchema, obj: any): void {
    const expectedSchema = {
        $ref: `https://enmeshed.eu/schemas/connector-api#/definitions/${schemaName}`
    };
    expect(obj).toMatchSchema(expectedSchema);
}

export function expectSuccess<T>(response: ConnectorResponse<T>, schema: ValidationSchema): void {
    expect(response.isSuccess, JSON.stringify(response.error)).toBeTruthy();
    validateSchema(schema, response.result);
}

export function expectError<T>(response: ConnectorResponse<T>, message: string, code: string): void {
    expect(response.isSuccess).toBeFalsy();
    expect(response.isError).toBeTruthy();
    expect(response.error.code).toStrictEqual(code);
    expect(response.error.message).toStrictEqual(message);
}
