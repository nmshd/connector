import fs from "fs";
import { ConnectorClient } from "../src";

async function run() {
    const client = ConnectorClient.create({
        baseUrl: process.env.BASE_URL!,
        apiKey: process.env.API_KEY!
    });

    const createdTemplate = await client.relationshipTemplates.createOwnRelationshipTemplate({
        content: { A: "A" },
        expiresAt: "2023",
        maxNumberOfAllocations: 5
    });

    const allTemplates = await client.relationshipTemplates.getOwnRelationshipTemplates();

    const retrievedTemplate = await client.relationshipTemplates.getRelationshipTemplate(createdTemplate.result!.id);

    console.log(retrievedTemplate);

    const qrCodeResponse = await client.relationshipTemplates.createTokenQrCodeForOwnRelationshipTemplate(createdTemplate.result!.id);
    await fs.promises.writeFile("qr.png", new Uint8Array(qrCodeResponse.result!));
}

run()
    .then(() => {
        process.exit(0);
    })
    .catch(() => {
        process.exit(1);
    });
