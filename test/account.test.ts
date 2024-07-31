import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { getTimeout } from "./lib/setTimeout";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client: ConnectorClient;

beforeAll(async () => ([client] = await launcher.launch(1)), getTimeout(30000));
afterAll(() => launcher.stop());

describe("Account Endpoints", () => {
    test("can get IdentityInfo", async () => {
        const identityInfo = await client.account.getIdentityInfo();
        expect(identityInfo).toBeSuccessful(ValidationSchema.IdentityInfo);
    });

    test("can sync", async () => {
        const sync = await client.account.sync();
        expect(sync.isSuccess).toBe(true);
        expect(sync.result).toBe("Sync successful");
    });

    test("can get the LastCompletedSyncRun", async () => {
        const lastCompletedSyncRun = await client.account.getSyncInfo();
        expect(lastCompletedSyncRun).toBeSuccessful(ValidationSchema.ConnectorSyncInfo);
    });
});
