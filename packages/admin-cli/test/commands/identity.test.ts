import { runCommand } from "@oclif/test";
import { resetDB, setupEnviroment } from "../utils";

describe("identity init", () => {
    const dbName = "identityInit";
    beforeAll(() => {
        setupEnviroment(dbName);
    });

    beforeEach(async () => {
        await resetDB(dbName);
    });

    test("identity creation", async () => {
        let result = await runCommand("identity init");
        expect(result.stdout.trim()).toContain("Identity created successfully!");

        result = await runCommand("identity init");
        expect(result.stdout.trim()).toContain("Identity already created!");
    });
    test("identity creation json output", async () => {
        let result = await runCommand("identity init --json");
        expect(result.result).toStrictEqual({ message: "Identity created successfully!" });

        result = await runCommand("identity init --json");
        expect(result.result).toStrictEqual({ message: "Identity already created!" });
    });
    test("identity status after creation adn deletion", async () => {
        const result = await runCommand("identity init");
        expect(result.stdout.trim()).toContain("Identity created successfully!");

        let statusResult = await runCommand("identity status");
        expect(statusResult.stdout.trim()).toContain("Id: ");

        const deltionResult = await runCommand("identityDeletion init");

        expect(deltionResult.error).toBeUndefined();

        statusResult = await runCommand("identity status");
        expect(statusResult.stdout.trim()).toContain("Id: ");
        expect(statusResult.stdout.trim()).toContain("Identity deletionm status: ");
        expect(statusResult.stdout.trim()).toContain("End of approval period: ");
        expect(statusResult.stdout.trim()).toContain("End of grace period: ");
    });
});
