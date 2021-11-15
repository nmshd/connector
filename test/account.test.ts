import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { expectSuccess, ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client: ConnectorClient;

beforeAll(async () => ([client] = await launcher.launch(1)), 30000);
afterAll(() => launcher.stop());

describe("Account Endpoints", () => {
    test("can get IdentityInfo", async () => {
        const identityInfo = await client.account.getIdentityInfo();
        expectSuccess(identityInfo, ValidationSchema.IdentityInfo);
    });

    test("can sync", async () => {
        const sync = await client.account.sync();
        expectSuccess(sync, ValidationSchema.ConnectorSyncResult);
    });

    test("can get the LastCompletedSyncRun", async () => {
        const lastCompletedSyncRun = await client.account.getSyncInfo();
        expectSuccess(lastCompletedSyncRun, ValidationSchema.ConnectorSyncInfo);
    });
});
