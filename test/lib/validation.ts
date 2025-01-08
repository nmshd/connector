import { ConnectorHttpResponse, getJSONSchemaDefinition } from "@nmshd/connector-sdk";
import ajv, { ErrorObject } from "ajv";
import { matchersWithOptions } from "jest-json-schema";
import _ from "lodash";

expect.extend(
    matchersWithOptions({
        schemas: [getJSONSchemaDefinition()]
    })
);

export enum ValidationSchema {
    Error = "ConnectorError",
    File = "ConnectorFile",
    Files = "ConnectorFiles",
    IdentityMetadata = "ConnectorIdentityMetadata",
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
    ConnectorAttributes = "ConnectorAttributes",
    ConnectorAttributeTagCollection = "ConnectorAttributeTagCollection",
    SucceedAttributeResponse = "SucceedAttributeResponse"
}

export function validateSchema(schemaName: ValidationSchema, obj: any): void {
    const expectedSchema = {
        $ref: `https://enmeshed.eu/schemas/connector-api#/definitions/${schemaName}`
    };
    expect(obj).toMatchSchema(expectedSchema);
}

const schemaDefinition = getJSONSchemaDefinition();
const ajvInstance = new ajv({ schemas: [schemaDefinition], allowUnionTypes: true });
type ExtendedError = ErrorObject<string, Record<string, any>, unknown> & { value: any };

expect.extend({
    toBeSuccessful(actual: ConnectorHttpResponse<unknown>, schemaName: ValidationSchema) {
        if (!(actual instanceof ConnectorHttpResponse)) {
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
            const extendedError: ExtendedError[] = validate.errors!.map((error): ExtendedError => {
                return Object.assign(error, { value: _.get(actual.result, error.instancePath.replaceAll("/", ".").slice(1)) });
            });
            return {
                pass: false,
                message: () => `expected a successful result to match the schema '${schemaName}', but got the following errors: ${JSON.stringify(extendedError, null, 2)}`
            };
        }

        return { pass: actual.isSuccess, message: () => "" };
    },

    toBeSuccessfulVoidResult(actual: ConnectorHttpResponse<unknown>) {
        if (!(actual instanceof ConnectorHttpResponse)) {
            return { pass: false, message: () => "expected an instance of Result." };
        }

        if (!actual.isSuccess) {
            const message = `expected a successful result; got an error result with the error message '${actual.error.message}'.`;
            return { pass: false, message: () => message };
        }

        if (typeof actual.result !== "undefined") {
            return {
                pass: false,
                message: () => `expected a successful result to be a void result, but got the following result: ${JSON.stringify(actual.result, null, 2)}`
            };
        }

        return { pass: actual.isSuccess, message: () => "" };
    },

    toBeAnError(actual: ConnectorHttpResponse<unknown>, expectedMessage: string | RegExp, expectedCode: string | RegExp) {
        if (!(actual instanceof ConnectorHttpResponse)) {
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
            toBeSuccessfulVoidResult(): R;
            toBeAnError(expectedMessage: string | RegExp, expectedCode: string | RegExp): R;
        }
    }
}
