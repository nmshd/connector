import { ConnectorClient } from "@nmshd/connector-sdk";
import { AxiosInstance } from "axios";
import { DateTime } from "luxon";
import { Launcher } from "./lib/Launcher";
import { getTimeout } from "./lib/setTimeout";

const launcher = new Launcher();
let client: ConnectorClient;
let axiosInstance: AxiosInstance;

beforeEach(async () => {
    [client] = await launcher.launch(1);

    axiosInstance = (client.account as any).httpClient;
}, getTimeout(30000));
afterEach(() => launcher.stop());

describe("Identity Deletion Process", () => {
    test("should start an identity deletion and get its status", async () => {
        const identityDeletionProcesses = await axiosInstance.post("/api/v2/IdentityDeletionProcess");
        expect(identityDeletionProcesses.status).toBe(200);
        expect(identityDeletionProcesses.data.result.status).toBe("Approved");
        expect(DateTime.fromISO(identityDeletionProcesses.data.result.gracePeriodEndsAt).toMillis()).toBeGreaterThan(DateTime.now().toMillis());

        const activeIdentityDeletionProcess = await axiosInstance.get("/api/v2/IdentityDeletionProcess");
        expect(activeIdentityDeletionProcess.status).toBe(200);
        expect(activeIdentityDeletionProcess.data.result.status).toBe(identityDeletionProcesses.data.result.status);
        expect(activeIdentityDeletionProcess.data.result.gracePeriodEndsAt).toBe(identityDeletionProcesses.data.result.gracePeriodEndsAt);
    });

    test("should cancel an identity deletion", async () => {
        const identityDeletionProcesses = await axiosInstance.post("/api/v2/IdentityDeletionProcess");
        expect(identityDeletionProcesses.status).toBe(200);
        expect(identityDeletionProcesses.data.result.status).toBe("Approved");
        expect(DateTime.fromISO(identityDeletionProcesses.data.result.gracePeriodEndsAt).toMillis()).toBeGreaterThan(DateTime.now().toMillis());

        const cancelIdentityDeletionProcess = await axiosInstance.post("/api/v2/IdentityDeletionProcess/cancel");
        expect(cancelIdentityDeletionProcess.status).toBe(200);
        expect(cancelIdentityDeletionProcess.data.result.status).toBe("Cancelled");
    });
});
