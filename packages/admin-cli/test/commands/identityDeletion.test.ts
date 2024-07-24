import { IdentityDeletionProcessStatus } from "@nmshd/transport";
import { runCommand } from "@oclif/test";
import { IdentityStatusCommandJSON } from "../../src/commands/identity/status";
import { startIdentityDeletionProcessFromBackboneAdminApi } from "../lib/AdminApiClient";
import { resetDB, setupEnviroment } from "../utils";

describe("identity deletion", () => {
    const dbName = "identityDeletion";
    beforeAll(() => {
        setupEnviroment(dbName);
    });

    beforeEach(async () => {
        await resetDB(dbName);
    });

    test("identity deletion init", async () => {
        let result = await runCommand("identity init");

        result = await runCommand("identityDeletion init");
        expect(result.stdout).toContain("Identity deletion initiated");
    });
    test("identity deletion init json", async () => {
        await runCommand("identity init");

        const deletionResult = await runCommand<any>("identityDeletion init --json");
        expect(deletionResult.error).toBeUndefined();
        expectValidResult(deletionResult, IdentityDeletionProcessStatus.Approved);
    });

    test("identity deletion cancel", async () => {
        await runCommand("identity init");
        await runCommand("identityDeletion init");

        const result = await runCommand("identityDeletion cancel");
        expect(result.error).toBeUndefined();
        expectValidResult(result, IdentityDeletionProcessStatus.Cancelled);
    });

    test("identity deletion approve", async () => {
        await runCommand("identity init");
        const identityResult = await runCommand<IdentityStatusCommandJSON>("identity status --json");
        expect(identityResult.error).toBeUndefined();
        expect(identityResult.result).toBeDefined();
        await startIdentityDeletionProcessFromBackboneAdminApi(identityResult.result!.address);

        const result = await runCommand("identityDeletion approve");
        expect(result.error).toBeUndefined();
        expectValidResult(result, IdentityDeletionProcessStatus.Approved);
    });

    test("identity deletion reject", async () => {
        await runCommand("identity init");
        const identityResult = await runCommand<IdentityStatusCommandJSON>("identity status --json");
        expect(identityResult.error).toBeUndefined();
        expect(identityResult.result).toBeDefined();
        await startIdentityDeletionProcessFromBackboneAdminApi(identityResult.result!.address);

        const result = await runCommand("identityDeletion reject");
        expect(result.error).toBeUndefined();
        expectValidResult(result, IdentityDeletionProcessStatus.Rejected);
    });
});

function expectValidResult(identityDeletionResult: any, status: IdentityDeletionProcessStatus) {
    expect(identityDeletionResult.result).toBeDefined();
    expect(Object.keys(identityDeletionResult.result).sort()).toStrictEqual(
        [
            "id",
            "createdAt",
            "createdByDevice",
            "approvalPeriodEndsAt",
            "rejectedAt",
            "rejectedByDevice",
            "approvedAt",
            "approvedByDevice",
            "gracePeriodEndsAt",
            "status",
            "cancelledAt",
            "cancelledByDevice"
        ].sort()
    );
    expect(identityDeletionResult.result.status).toBe(status);
}
