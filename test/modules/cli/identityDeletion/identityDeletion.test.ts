import { identityDeletionCancelHandler, identityDeletionInitHandler, identityInitHandler } from "../../../../dist/cli/commands";
import { resetDB, setupEnvironment } from "../setup";

describe("Identity deletion", () => {
    beforeAll(async () => {
        setupEnvironment();
        await identityInitHandler({});
    });

    afterAll(async () => {
        await resetDB();
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
