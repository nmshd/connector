import fs from "fs";
import { ConnectorClient } from "../src";

async function run() {
    const client = ConnectorClient.create({
        baseUrl: process.env.BASE_URL!,
        apiKey: process.env.API_KEY!
    });

    const createdToken = (
        await client.tokens.createOwnToken({
            expiresAt: "2023",
            content: { a: "a" }
        })
    ).result!;

    const getTokenResponse = await client.tokens.getToken(createdToken.id);
    console.log(getTokenResponse.result);

    const qr = await client.tokens.getQrCodeForToken(createdToken.id);
    await fs.promises.writeFile("qr.png", new Uint8Array(qr.result!));
}

run()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
