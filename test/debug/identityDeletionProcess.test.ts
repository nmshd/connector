import { ConnectorClient } from "@nmshd/connector-sdk";
import { AxiosInstance } from "axios";
import { DateTime } from "luxon";
import { Launcher } from "../lib/Launcher";
import { getTimeout } from "../lib/setTimeout";

const launcher = new Launcher();
let client: ConnectorClient;
let axiosInstance: AxiosInstance;

beforeAll(async () => {
    [client] = await launcher.launch(1);

    axiosInstance = (client.account as any).httpClient;
}, getTimeout(30000));
afterAll(() => launcher.stop());

interface IdentityDeletionProcess {
    id: string;
    status: "WaitingForApproval" | "Rejected" | "Approved" | "Cancelled";
    createdAt?: string;
    createdByDevice?: string;
    approvalPeriodEndsAt?: string;
    rejectedAt?: string;
    rejectedByDevice?: string;
    approvedAt?: string;
    approvedByDevice?: string;
    gracePeriodEndsAt?: string;
    cancelledAt?: string;
    cancelledByDevice?: string;
}

describe("Identity Deletion Process", () => {
    afterEach(async () => await axiosInstance.delete("/api/core/v1/IdentityDeletionProcess"));

    test("should return 400 when no identity deletion process is active", async () => {
        const getResult = await axiosInstance.get("/api/core/v1/IdentityDeletionProcess");
        expect(getResult.status).toBe(400);
    });

    test("should start an identity deletion and get its status", async () => {
        const response = await axiosInstance.post<{ result: IdentityDeletionProcess }>("/api/core/v1/IdentityDeletionProcess");

        expect(response.status).toBe(200);
        const identityDeletionProcess = response.data.result;
        expect(identityDeletionProcess.status).toBe("Approved");
        expect(DateTime.fromISO(identityDeletionProcess.gracePeriodEndsAt!).toMillis()).toBeGreaterThan(DateTime.now().toMillis());
    });

    test("should get the active identity deletion process", async () => {
        const initiateResult = await axiosInstance.post<{ result: IdentityDeletionProcess }>("/api/core/v1/IdentityDeletionProcess");
        expect(initiateResult.status).toBe(200);
        const identityDeletionProcess = initiateResult.data.result;

        const getResult = await axiosInstance.get<{ result: IdentityDeletionProcess }>("/api/core/v1/IdentityDeletionProcess");
        expect(getResult.status).toBe(200);
        expect(getResult.data.result.status).toBe(identityDeletionProcess.status);
        expect(getResult.data.result.gracePeriodEndsAt).toBe(identityDeletionProcess.gracePeriodEndsAt);
    });

    test("should return 400 when trying to start a new identity deletion process", async () => {
        const initiateResult = await axiosInstance.post<{ result: IdentityDeletionProcess }>("/api/core/v1/IdentityDeletionProcess");
        expect(initiateResult.status).toBe(200);

        const initiateResult2 = await axiosInstance.post("/api/core/v1/IdentityDeletionProcess");
        expect(initiateResult2.status).toBe(400);
    });

    test("should cancel an identity deletion", async () => {
        const initiateResult = await axiosInstance.post<{ result: IdentityDeletionProcess }>("/api/core/v1/IdentityDeletionProcess");
        expect(initiateResult.status).toBe(200);

        const cancelResult = await axiosInstance.delete("/api/core/v1/IdentityDeletionProcess");
        expect(cancelResult.status).toBe(200);
        expect(cancelResult.data.result.status).toBe("Cancelled");

        const getResult = await axiosInstance.get("/api/core/v1/IdentityDeletionProcess");
        expect(getResult.status).toBe(400);
    });
});
