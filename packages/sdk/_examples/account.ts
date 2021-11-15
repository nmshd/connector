import { ConnectorClient } from "../src";

async function run() {
    const client = ConnectorClient.create({
        baseUrl: process.env.BASE_URL!,
        apiKey: process.env.API_KEY!
    });

    const identityInfo = await client.account.getIdentityInfo();
    console.log(identityInfo.result);

    const connectorSyncResult = await client.account.sync();
    console.log(connectorSyncResult.result);

    const lastCompletedSyncRun = await client.account.getSyncInfo();
    console.log(lastCompletedSyncRun.result);
}

run()
    .then(() => {
        process.exit(0);
    })
    .catch(() => {
        process.exit(1);
    });
