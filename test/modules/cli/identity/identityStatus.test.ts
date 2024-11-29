import { sleep } from "@js-soft/ts-utils";
import { identityDeletionInitHandler, identityStatusHandler } from "../../../../dist/cli/commands";
import { resetDB, setupEnvironment } from "../setup";

describe("Identity status", () => {
    const identityStatusPattern = /Id: did:e:((([A-Za-z0-9]+(-[A-Za-z0-9]+)*)\.)+[a-z]{2,}|localhost):dids:[0-9a-f]{22}/;

    beforeAll(() => {
        setupEnvironment();
    });

    afterAll(async () => {
        await resetDB();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("show identity status", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await identityStatusHandler({});
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy.mock.lastCall![0]).toMatch(identityStatusPattern);

        await identityDeletionInitHandler({});
        await sleep(1000);
        expect(consoleSpy).toHaveBeenCalledWith("Identity deletion initiated");
        expect(consoleSpy).toHaveBeenCalledTimes(2);

        await identityStatusHandler({});
        expect(consoleSpy).toHaveBeenCalledTimes(3);
        expect(consoleSpy.mock.lastCall![0]).toMatch(identityStatusPattern);
        expect(consoleSpy.mock.lastCall![0]).toContain("Identity deletion status: Approved");
        expect(consoleSpy.mock.lastCall![0]).toMatch(/End of approval period:/);
        expect(consoleSpy.mock.lastCall![0]).toMatch(/End of grace period:/);
    });
});
