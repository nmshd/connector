import { identityInitHandler } from "../../../../dist/cli/commands";
import { resetDB, setupEnvironment } from "../setup";

describe("identity init", () => {
    const identityCreatedPattern = /Identity with address did:e:((([A-Za-z0-9]+(-[A-Za-z0-9]+)*)\.)+[a-z]{2,}|localhost):dids:[0-9a-f]{22} created successfully\./;

    beforeAll(() => {
        setupEnvironment();
    });

    afterAll(async () => {
        await resetDB();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("identity should be created", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await identityInitHandler({ config: undefined });
        expect(consoleSpy.mock.lastCall![0]).toMatch(identityCreatedPattern);
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    test("identity should not be created when one already exists", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await identityInitHandler({ config: undefined });
        await identityInitHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledWith("Identity already created!");
        expect(consoleSpy).toHaveBeenCalledTimes(2);
    });
});
