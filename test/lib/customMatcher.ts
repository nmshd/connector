import { SerializableBase } from "@js-soft/ts-serval";
import { set } from "lodash";
import type {} from "vitest";

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

        excludes.forEach((exclude) => {
            set(receivedClone, exclude, undefined);
            set(expectedClone, exclude, undefined);
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
            message = `${this.utils.matcherHint(matcherName, undefined, undefined, options)}\n\n${this.utils.printDiffOrStringify(expectedClone, receivedClone)}`;
        }

        return { message: () => message, pass };
    }
});

declare module "vitest" {
    // Vitest requires both type parameters; these matchers do not use the received value type.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T> {
        toStrictEqualExcluding(expected: unknown, ...ignoreProperties: string[]): R;
    }
}
