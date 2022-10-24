import { ConnectorResponse, getJSONSchemaDefinition } from "@nmshd/connector-sdk";
import ajv from "ajv";
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
    ConnectorSyncInfo = "ConnectorSyncInfo",
    ConnectorChallenge = "ConnectorChallenge",
    ConnectorChallengeValidationResult = "ConnectorChallengeValidationResult",
    ConnectorRequest = "ConnectorRequest",
    ConnectorRequests = "ConnectorRequests",
    ConnectorAttribute = "ConnectorAttribute",
    ConnectorAttributes = "ConnectorAttributes"
}

export function validateSchema(schemaName: ValidationSchema, obj: any): void {
    const expectedSchema = {
        $ref: `https://enmeshed.eu/schemas/connector-api#/definitions/${schemaName}`
    };
    expect(obj).toMatchSchema(expectedSchema);
}

const schemaDefinition = getJSONSchemaDefinition();
const ajvInstance = new ajv({ schemas: [schemaDefinition], allowUnionTypes: true });

expect.extend({
    toBeSuccessful(actual: ConnectorResponse<unknown>, schemaName: ValidationSchema) {
        if (!(actual instanceof ConnectorResponse)) {
            return { pass: false, message: () => "expected an instance of Result." };
        }

        if (!actual.isSuccess) {
            const message = `expected a successful result; got an error result with the error message '${actual.error.message}'.`;
            return { pass: false, message: () => message };
        }

        const expectedSchema = {
            $ref: `https://enmeshed.eu/schemas/connector-api#/definitions/${schemaName}`
        };
        const validate = ajvInstance.compile(expectedSchema);
        const valid = validate(actual.result);

        if (!valid) {
            return {
                pass: false,
                message: () => `expected a successful result to match the schema '${schemaName}', but got the following errors: ${JSON.stringify(validate.errors)}`
            };
        }

        return { pass: actual.isSuccess, message: () => "" };
    },

    toBeAnError(actual: ConnectorResponse<unknown>, expectedMessage: string | RegExp, expectedCode: string | RegExp) {
        if (!(actual instanceof ConnectorResponse)) {
            return {
                pass: false,
                message: () => "expected an instance of Result."
            };
        }

        if (!actual.isError) {
            return {
                pass: false,
                message: () => "expected an error result, but it was successful."
            };
        }

        if (actual.error.message.match(new RegExp(expectedMessage)) === null) {
            return {
                pass: false,
                message: () => `expected the error message of the result to match '${expectedMessage}', but received '${actual.error.message}'.`
            };
        }

        if (actual.error.code.match(new RegExp(expectedCode)) === null) {
            return {
                pass: false,
                message: () => `expected the error code of the result to match '${expectedCode}', but received '${actual.error.code}'.`
            };
        }

        return { pass: true, message: () => "" };
    }
});

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeSuccessful(schema: ValidationSchema): R;
            toBeAnError(expectedMessage: string | RegExp, expectedCode: string | RegExp): R;
        }
    }
}
