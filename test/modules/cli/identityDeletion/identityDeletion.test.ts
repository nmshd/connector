import { identityDeletionCancelHandler, identityDeletionInitHandler } from "../../../../dist/cli/commands";
import { resetDB, setupEnvironment } from "../setup";

describe("Identity deletion", () => {
    const randomAccountName = Math.random().toString(36).substring(2, 15);

    beforeAll(() => {
        setupEnvironment(randomAccountName);
    });

    afterAll(async () => {
        await resetDB(randomAccountName);
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("initiate identity deletion", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await identityDeletionInitHandler({});
        expect(consoleSpy).toHaveBeenCalledWith("Identity deletion initiated");
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    test("cancel identity deletion", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await identityDeletionCancelHandler({});
        expect(consoleSpy).toHaveBeenCalledWith("Identity deletion cancelled");
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
});
