import { sleep } from "@js-soft/ts-utils";
import { ConnectorClient, ConnectorRelationshipStatus } from "@nmshd/connector-sdk";

async function run() {
    const connector1 = ConnectorClient.create({
        baseUrl: "http://localhost:3000",
        apiKey: "xxx"
    });

    const connector2 = ConnectorClient.create({
        baseUrl: "http://localhost:3001",
        apiKey: "xxx"
    });

    const { connector1Address, connector2Address } = await establishOrReturnRelationship(connector1, connector2);

    while (true) {
        await connector1.messages.sendMessage({ recipients: [connector2Address], content: {} });
        await sleep(2000);

        await connector2.messages.sendMessage({ recipients: [connector1Address], content: {} });
        await sleep(2000);
    }
}

async function establishOrReturnRelationship(connector1: ConnectorClient, connector2: ConnectorClient) {
    const identityInfo = (await connector1.account.getIdentityInfo()).result;

    const relationships = (await connector1.relationships.getRelationships()).result;

    if (relationships.length > 0) {
        if (relationships[0].status === ConnectorRelationshipStatus.PENDING) {
            await connector1.relationships.acceptRelationshipChange(relationships[0].id, relationships[0].changes[0].id);
        }

        return {
            connector1Address: identityInfo.address,
            connector2Address: relationships[0].peer
        };
    }

    const template = (await connector1.relationshipTemplates.createOwnRelationshipTemplate({ expiresAt: "2099", maxNumberOfAllocations: 1, content: {} })).result;

    await connector2.relationshipTemplates.loadPeerRelationshipTemplate({ reference: template.truncatedReference });

    const relationship = (await connector2.relationships.createRelationship({ templateId: template.id, content: {} })).result;

    await connector1.account.sync();

    const accepted = (await connector1.relationships.acceptRelationshipChange(relationship.id, relationship.changes[0].id)).result;
    console.log(accepted);

    await connector2.account.sync();

    return {
        connector1Address: identityInfo.address,
        connector2Address: accepted.peer
    };
}

run()
    .then(() => {
        console.log("Script finished successfully");
    })
    .catch((error) => {
        console.error("Script failed with error", error);
    });
