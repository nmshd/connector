import { ConnectorClient } from "../src";

async function run() {
    const client = ConnectorClient.create({
        baseUrl: process.env.BASE_URL!,
        apiKey: process.env.API_KEY!
    });

    const createdRelationship = await client.relationships.createRelationship({
        templateId: "RLT_________________",
        content: {
            prop1: "value",
            prop2: 1
        }
    });
    console.log(createdRelationship);

    const syncedRelationships = await client.account.sync();
    const relationship = syncedRelationships.result!.relationships[0];

    const acceptedRelationship = await client.relationships.acceptRelationshipChange(relationship.id, relationship.changes[0].id, { content: { a: "b" } });
    console.log(acceptedRelationship);
}

run()
    .then(() => {
        process.exit(0);
    })
    .catch(() => {
        process.exit(1);
    });
