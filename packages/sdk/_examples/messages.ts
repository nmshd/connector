import { ConnectorClient } from "../src";

async function run() {
    const client = ConnectorClient.create({
        baseUrl: process.env.BASE_URL!,
        apiKey: process.env.API_KEY!
    });

    const sentMessage = await client.messages.sendMessage({
        recipients: ["id1343523509859032455"],
        content: { A: "B" }
    });
}

run()
    .then(() => {
        process.exit(0);
    })
    .catch(() => {
        process.exit(1);
    });
