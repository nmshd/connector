import { ConnectorClient } from "../src";

async function run() {
    const client = ConnectorClient.create({
        baseUrl: process.env.BASE_URL!,
        apiKey: process.env.API_KEY!
    });

    const createdRelationship = await client.relationships.createRelationship({
        templateId: "RLT_________________",
        creationContent: {
            "@type": "ArbitraryRelationshipCreationContent",
            value: {
                prop1: "value",
                prop2: 1
            }
        }
    });
    console.log(createdRelationship);

    const acceptedRelationship = await client.relationships.acceptRelationship("REL_________________");
    console.log(acceptedRelationship);
}

run()
    .then(() => {
        process.exit(0);
    })
    .catch(() => {
        process.exit(1);
    });
