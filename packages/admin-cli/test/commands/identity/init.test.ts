import { expect, test } from "@oclif/test";

describe("identity init", () => {
    test.stdout()
        .command(["identity init"])
        .it("should create an identity", (ctx) => {
            expect(ctx.stdout).to.contain("hello world!");
        });
});
