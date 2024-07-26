import { identityInitHandler } from "../../src/commands/identity/init";
import { identityStatusHandler } from "../../src/commands/identity/status";
import { identityDeletionApproveHandler } from "../../src/commands/identityDeletion/approve";
import { identityDeletionCancelHandler } from "../../src/commands/identityDeletion/cancel";
import { identityDeletionInitHandler } from "../../src/commands/identityDeletion/init";
import { identityDeletionRejectHandler } from "../../src/commands/identityDeletion/reject";
import { startIdentityDeletionProcessFromBackboneAdminApi } from "../lib/AdminApiClient";
import { resetDB, setupEnviroment } from "../utils";

describe("identity deletion", () => {
    const dbName = "identityDeletion";
    let originalArgv: any;
    beforeAll(() => {
        setupEnviroment(dbName);
    });

    afterEach(() => {
        jest.resetAllMocks();

        // Set process arguments back to the original value
        process.argv = originalArgv;
    });

    beforeEach(async () => {
        await resetDB(dbName);
        // Remove all cached modules. The cache needs to be cleared before running
        // each command, otherwise you will see the same results from the command
        // run in your first test in subsequent tests.
        jest.resetModules();

        // Each test overwrites process arguments so store the original arguments
        originalArgv = process.argv;
    });

    test("identity deletion init", async () => {
        await identityInitHandler({ config: undefined });
        const consoleSpy = jest.spyOn(console, "log");

        await identityDeletionInitHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledWith("Identity deletion initiated");
        expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    test("identity deletion cancel", async () => {
        await identityInitHandler({ config: undefined });
        await identityDeletionInitHandler({ config: undefined });

        const consoleSpy = jest.spyOn(console, "log");
        await identityDeletionCancelHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledWith("Identity deletion canceled");
    });

    test("identity deletion approve", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await identityInitHandler({ config: undefined });

        await identityStatusHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledTimes(2);

        const statusOutput = consoleSpy.mock.lastCall?.[0] as string;
        const identityId = statusOutput.match(/Id: (\w+)/)?.[1];

        expect(identityId).toBeDefined();
        await startIdentityDeletionProcessFromBackboneAdminApi(identityId!);

        await identityDeletionApproveHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledTimes(3);
        expect(consoleSpy).toHaveBeenCalledWith("Identity deletion approved");
    });

    test("identity deletion reject", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await identityInitHandler({ config: undefined });

        await identityStatusHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledTimes(2);

        const statusOutput = consoleSpy.mock.lastCall?.[0] as string;
        const identityId = statusOutput.match(/Id: (\w+)/)?.[1];

        expect(identityId).toBeDefined();
        await startIdentityDeletionProcessFromBackboneAdminApi(identityId!);

        await identityDeletionRejectHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledTimes(3);
        expect(consoleSpy).toHaveBeenCalledWith("Identity deletion rejected");
    });
});
