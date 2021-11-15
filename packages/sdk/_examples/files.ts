import fs from "fs";
import { ConnectorClient } from "../src";

async function run() {
    const client = ConnectorClient.create({
        baseUrl: process.env.BASE_URL!,
        apiKey: process.env.API_KEY!
    });

    const uploadOwnFileResponse = await client.files.uploadOwnFile({
        title: "file.txt",
        description: "Test file",
        expiresAt: "2025",
        file: await fs.promises.readFile(__dirname + "/__assets/file.txt"),
        filename: "file.txt"
    });

    const uploadedFile = uploadOwnFileResponse.result!;

    const getFileResponse = await client.files.getFile(uploadedFile.id);

    const downloadFileResponse = await client.files.downloadFile(uploadedFile.id);

    const createTokenForFileResponse = await client.files.createTokenForFile(uploadedFile.id);

    const getOwnFilesResponse = await client.files.getOwnFiles();

    const filteredGetOwnFilesResponse = await client.files.getOwnFiles({ createdAt: ">=2021-01-01T00:00:00.000Z" });

    const getAllFilesResponse = await client.files.getFiles();

    const loadPeerFileResponse = await client.files.loadPeerFile({ reference: "TRUNCATED_REFERENCE_OF_PEER_FILE" });

    const getPeerFilesResponse = await client.files.getPeerFiles();

    const qr = await client.files.createTokenQrCodeForFile(uploadOwnFileResponse.result!.id);
    await fs.promises.writeFile("qr.png", new Uint8Array(qr.result!));
}

run()
    .then(() => {
        process.exit(0);
    })
    .catch(() => {
        process.exit(1);
    });
