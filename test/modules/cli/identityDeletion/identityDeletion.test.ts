import { identityDeletionCancelHandler, identityDeletionInitHandler } from "../../../../dist/cli/commands";
import { resetDB, setupEnvironment } from "../setup";

describe("identity deletion", () => {
    beforeAll(() => {
        setupEnvironment();
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
        expect(consoleSpy).toHaveBeenCalledWith("Identity deletion canceled");
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
});
