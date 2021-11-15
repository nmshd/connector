import { ConnectorClient } from "../src";

async function run() {
    const client = ConnectorClient.create({
        baseUrl: process.env.BASE_URL!,
        apiKey: process.env.API_KEY!
    });

    const health = await client.monitoring.getHealth().catch((e) => console.log(e));
    console.log(health);

    const version = await client.monitoring.getVersion().catch((e) => console.log(e));
    console.log(version);

    const responses = await client.monitoring.getRequests();
    console.log(responses);

    const support = await client.monitoring.getSupport();
    console.log(support);
}

run()
    .then(() => {
        process.exit(0);
    })
    .catch(() => {
        process.exit(1);
    });
