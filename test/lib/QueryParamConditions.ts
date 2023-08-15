/* eslint-disable jest/no-standalone-expect */

import { ConnectorClient, ConnectorResponse } from "@nmshd/connector-sdk";
import { DateTime } from "luxon";
import { ValidationSchema } from "./validation";

type QueryFunction = (client: ConnectorClient, params: any) => Promise<any>;

export interface ICondition {
    key: string;
    value: string | boolean | number | string[] | boolean[] | number[];
    expectedResult: boolean;
}

export class QueryParamConditions {
    private readonly _conditions: ICondition[];

    public constructor(
        private readonly object: any,
        private readonly connectorClient: ConnectorClient
    ) {
        this._conditions = [];
    }

    public addDateSet(key: string, positiveValue?: string): this {
        if (!positiveValue) {
            positiveValue = this.getValueByKey(key);
        }

        if (!positiveValue) {
            return this;
        }

        this._conditions.push({
            key,
            value: positiveValue,
            expectedResult: true
        });

        const positiveValueAsDate = DateTime.fromISO(positiveValue);

        this._conditions.push({
            key,
            value: positiveValueAsDate.plus({ hours: 24 }).toString(),
            expectedResult: false
        });

        this._conditions.push({
            key,
            value: positiveValueAsDate.minus({ hours: 24 }).toString(),
            expectedResult: false
        });

        return this;
    }

    public addBooleanSet(key: string, positiveValue?: boolean): this {
        if (positiveValue === undefined) {
            positiveValue = this.getValueByKey(key) as boolean | undefined;
        }

        if (positiveValue === undefined) {
            return this;
        }

        this._conditions.push({
            key,
            value: positiveValue,
            expectedResult: true
        });

        this._conditions.push({
            key,
            value: !positiveValue,
            expectedResult: false
        });

        return this;
    }

    public addNumberSet(key: string, positiveValue?: number): this {
        if (!positiveValue) {
            positiveValue = this.getValueByKey(key);
        }

        if (!positiveValue) {
            return this;
        }

        this._conditions.push({
            key,
            value: positiveValue,
            expectedResult: true
        });

        this._conditions.push({
            key,
            value: (positiveValue + 1).toString(),
            expectedResult: false
        });

        this._conditions.push({
            key,
            value: (positiveValue - 1).toString(),
            expectedResult: false
        });

        return this;
    }

    public addStringSet(key: string, positiveValue?: string): this {
        if (!positiveValue) {
            positiveValue = this.getValueByKey(key);
        }

        if (!positiveValue) {
            return this;
        }

        this._conditions.push({
            key,
            value: positiveValue,
            expectedResult: true
        });

        this._conditions.push({
            key,
            value: positiveValue.replace(/....$/, "XXXX"),
            expectedResult: false
        });

        return this;
    }

    public addSingleCondition(condition: ICondition): this {
        this._conditions.push(condition);
        return this;
    }

    public addStringArraySet(key: string): this {
        const positiveValueArray = this.getValueByKey(key);
        if (!positiveValueArray || positiveValueArray.length === 0) {
            return this;
        }
        const positiveValue = positiveValueArray[0];

        this._conditions.push({
            key,
            value: positiveValue,
            expectedResult: true
        });

        this._conditions.push({
            key,
            value: positiveValue.replace(/....$/, "XXXX"),
            expectedResult: false
        });

        return this;
    }

    private getValueByKey(key: string) {
        const keyParts = key.split(".");
        let value = this.object;
        for (const keyPart of keyParts) {
            if (!value) return;
            value = value[keyPart];
        }

        return value;
    }

    public async executeTests(queryFunction: QueryFunction, schema: ValidationSchema): Promise<void> {
        if (this._conditions.length < 1) {
            throw new Error("The conditions list may not be empty.");
        }

        for (const condition of this._conditions) {
            const response: ConnectorResponse<any> = await queryFunction(this.connectorClient, { [condition.key]: condition.value });

            expect(response).toBeSuccessful(schema);

            if (condition.expectedResult) {
                expect(response.result, `Positive match failed for key "${condition.key}" and value "${condition.value}".`).toContainEqual(this.object);
            } else {
                expect(response.result, `Negative match failed for key "${condition.key}" and value "${condition.value}".`).not.toContainEqual(this.object);
            }
        }
    }
}
