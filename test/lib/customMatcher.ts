import { SerializableBase } from "@js-soft/ts-serval";
import { set } from "lodash";

expect.extend({
    toStrictEqualExcluding(received: unknown, expected: unknown, ...excludes: string[]) {
        if (received instanceof SerializableBase) {
            received = received.toJSON();
        }
        if (expected instanceof SerializableBase) {
            expected = expected.toJSON();
        }

        const receivedClone = JSON.parse(JSON.stringify(received));
        const expectedClone = JSON.parse(JSON.stringify(expected));

        excludes.forEach((exclud) => {
            set(receivedClone, exclud, undefined);
            set(expectedClone, exclud, undefined);
        });

        const matcherName = "toStrictEqual";
        const options = {
            comment: "deep equality",
            isNot: this.isNot,
            promise: this.promise
        };

        const pass = this.equals(receivedClone, expectedClone, undefined, true);

        let message: string;
        if (pass) {
            message =
                `${this.utils.matcherHint(matcherName, undefined, undefined, options)}\n\n` +
                `Expected: not ${this.utils.printExpected(expectedClone)}\n${
                    this.utils.stringify(expectedClone) === this.utils.stringify(receivedClone) ? "" : `Received:     ${this.utils.printReceived(receivedClone)}`
                }`;
        } else {
            message = `${this.utils.matcherHint(matcherName, undefined, undefined, options)}\n\n${this.utils.printDiffOrStringify(
                expectedClone,
                receivedClone,
                "Expected",
                "Received",
                this.expand ?? true
            )}`;
        }

        return { message: () => message, pass };
    }
});

export {};

declare global {
    namespace jest {
        interface Matchers<R> {
            toStrictEqualExcluding(expected: unknown, ...ignoreProperties: string[]): R;
        }
    }
}
