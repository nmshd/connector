import { identityDeletionCancelHandler, identityDeletionInitHandler } from "../../../../src/cli/commands";
import { resetDB, setupEnvironment } from "../setup";

describe("Identity deletion", () => {
    const randomAccountName = Math.random().toString(36).substring(2, 15);

    beforeAll(async () => {
        await setupEnvironment(randomAccountName);
    });

    afterAll(async () => {
        await resetDB(randomAccountName);
    });

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    test("initiate identity deletion", async () => {
        const consoleSpy = vi.spyOn(console, "log");
        await identityDeletionInitHandler({});
        expect(consoleSpy).toHaveBeenCalledWith("Identity deletion initiated");
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    test("cancel identity deletion", async () => {
        const consoleSpy = vi.spyOn(console, "log");
        await identityDeletionCancelHandler({});
        expect(consoleSpy).toHaveBeenCalledWith("Identity deletion cancelled");
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
});
