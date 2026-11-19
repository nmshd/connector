import type {} from "vitest";
import { ConnectorHttpResponse, getJSONSchemaDefinition } from "@nmshd/connector-sdk";
import ajv, { ErrorObject, Schema } from "ajv";
import _ from "lodash";
import addFormats from "ajv-formats";

export enum ValidationSchema {
    Error = "ConnectorError",
    IdentityInfo = "IdentityInfo",
    ConnectorVersionInfo = "ConnectorVersionInfo",
    ConnectorRequestCount = "ConnectorRequestCount",
    ConnectorSupportInformation = "ConnectorSupportInformation",
    ConnectorSyncInfo = "ConnectorSyncInfo",
    ConnectorChallengeValidationResult = "ConnectorChallengeValidationResult",
    SucceedAttributeResponse = "SucceedAttributeResponse",
    DeleteAttributeAndNotifyResponse = "DeleteAttributeAndNotifyResponse"
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

const schemaAjv = new ajv({ schemas: [schemaDefinition], allErrors: true, strict: false });

addFormats(schemaAjv);

expect.extend({
    toMatchSchema(actual: unknown, schema: Schema) {
        const validate = schemaAjv.compile(schema);
        const pass = validate(actual);
        return {
            pass,
            message: () =>
                pass ? "expected value not to match the schema" : `expected value to match the schema, but got the following errors: ${JSON.stringify(validate.errors, null, 2)}`
        };
    },
    toBeSuccessful(actual: ConnectorHttpResponse<unknown>, schemaName?: ValidationSchema) {
        if (!(actual instanceof ConnectorHttpResponse)) {
            return { pass: false, message: () => "expected an instance of Result." };
        }

        if (!actual.isSuccess) {
            const message = `expected a successful result; got an error result with the error message '${actual.error.message}'.`;
            return { pass: false, message: () => message };
        }

        if (!schemaName) return { pass: true, message: () => "" };

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

declare module "vitest" {
    // Vitest requires both type parameters; these matchers do not use the received value type.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T> {
        toMatchSchema(schema: Schema): R;
        toBeSuccessful(schema?: ValidationSchema): R;
        toBeSuccessfulVoidResult(): R;
        toBeAnError(expectedMessage: string | RegExp, expectedCode: string | RegExp): R;
    }
}
