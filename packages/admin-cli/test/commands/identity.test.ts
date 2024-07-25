import { identityInitHandler } from "../../src/commands/identity/init";
import { resetDB, setupEnviroment } from "../utils";

describe("identity init", () => {
    const dbName = "identityInit";
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

    test("identity creation", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await identityInitHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledWith("Identity created successfully!");
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        await identityInitHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledWith("Identity already created!");
        expect(consoleSpy).toHaveBeenCalledTimes(2);
    });

    test("identity status after creation adn deletion", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await identityInitHandler({ config: undefined });

        expect(consoleSpy).toHaveBeenCalledWith("Identity created successfully!");
        expect(consoleSpy).toHaveBeenCalledTimes(1);

        // TODO: let statusResult = await runCommand("identity status");
        // expect(statusResult.stdout.trim()).toContain("Id: ");

        // const deltionResult = await runCommand("identityDeletion init");

        // expect(deltionResult.error).toBeUndefined();

        // statusResult = await runCommand("identity status");
        // expect(statusResult.stdout.trim()).toContain("Id: ");
        // expect(statusResult.stdout.trim()).toContain("Identity deletionm status: ");
        // expect(statusResult.stdout.trim()).toContain("End of approval period: ");
        // expect(statusResult.stdout.trim()).toContain("End of grace period: ");
    });
});
