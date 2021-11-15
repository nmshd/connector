import { ConnectorClient, ConnectorFile } from "@nmshd/connector-sdk";
import fs from "fs";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { combinations, exchangeFile, makeUploadRequest, uploadFile } from "./lib/testUtils";
import { expectError, expectSuccess, ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

const UNKOWN_FILE_ID = "FILXXXXXXXXXXXXXXXXX";
const UNKOWN_TOKEN_ID = "TOKXXXXXXXXXXXXXXXXX";

const illegalParameters = [null, undefined, ""];

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), 30000);
afterAll(() => launcher.stop());

describe("File Upload", () => {
    let file: ConnectorFile;

    test("can upload file", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest());

        expectSuccess(response, ValidationSchema.File);

        file = response.result;
    });

    test("uploaded files can be accessed under /Files", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.getFiles({ createdAt: file.createdAt });
        expectSuccess(response, ValidationSchema.Files);
        expect(response.result).toContainEqual(file);
    });

    test("uploaded files can be accessed under /Files/Own", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.getOwnFiles({ createdAt: file.createdAt });
        expectSuccess(response, ValidationSchema.Files);
        expect(response.result).toContainEqual(file);
    });

    test("uploaded files can be accessed under /Files/{id}", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.getFile(file.id);
        expectSuccess(response, ValidationSchema.File);
    });

    test("uploaded files keep their size", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.downloadFile(file.id);
        expect(response.isSuccess).toBeTruthy();
        expect(response.result.byteLength).toBe(4);
    });

    test("cannot upload an empty file", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ file: Buffer.of() }));
        expectError(response, "file content is empty", "error.runtime.validation.invalidPropertyValue");
    });

    test("cannot upload a file that is null", async () => {
        // Cannot use client1.files.uploadOwn because it cannot deal with null values
        const _response = await (client1.files as any).httpClient.post("/api/v1/Files/Own", makeUploadRequest({ file: null }));
        const response = (client1.files as any).makeResult(_response);

        expectError(response, "file content is empty", "error.runtime.validation.invalidPropertyValue");
    });
    test("can upload same file twice", async () => {
        const request = await makeUploadRequest({ file: await fs.promises.readFile(`${__dirname}/__assets__/test.txt`) });

        const response1 = await client1.files.uploadOwnFile(request);
        const response2 = await client1.files.uploadOwnFile(request);
        expectSuccess(response1, ValidationSchema.File);
        expectSuccess(response2, ValidationSchema.File);
    });

    test("file description is optional", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ description: "" }));
        expectSuccess(response, ValidationSchema.File);
    });

    test("cannot upload a file with empty expiry date", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ expiresAt: "" }));
        expectError(response, "'expiresAt' must be in the future.", "error.runtime.validation.invalidPropertyValue");
    });
});

describe("Get file", () => {
    test("can get file by id", async () => {
        const file = await uploadFile(client1);
        const response = await client1.files.getFile(file.id);

        expectSuccess(response, ValidationSchema.File);
        expect(response.result).toMatchObject(file);
    });

    test("accessing not existing file id causes an error", async () => {
        const notPresentFileId = "FILXXXXXXXXXXXXXXXXX";
        const response = await client1.files.getFile(notPresentFileId);
        expectError(response, "File not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });
});

describe("Files query", () => {
    test("files can be queried by their attributes", async () => {
        const file = await uploadFile(client1);
        const conditions = new QueryParamConditions(file, client1)
            .addDateSet("createdAt")
            .addDateSet("createdBy")
            .addDateSet("createdByDevice")
            .addDateSet("deletedAt")
            .addDateSet("deletedBy")
            .addDateSet("deletedByDevice")
            .addStringSet("description")
            .addDateSet("expiresAt")
            .addStringSet("filename")
            .addNumberSet("filesize")
            .addStringSet("mimetype")
            .addStringSet("title")
            .addBooleanSet("isOwn");

        await conditions.executeTests((c, q) => c.files.getFiles(q), ValidationSchema.Files);
    });

    test("own files can be queried by their attributes", async () => {
        const file = await uploadFile(client1);
        const conditions = new QueryParamConditions(file, client1)
            .addDateSet("createdAt")
            .addDateSet("createdBy")
            .addDateSet("createdByDevice")
            .addDateSet("deletedAt")
            .addDateSet("deletedBy")
            .addDateSet("deletedByDevice")
            .addStringSet("description")
            .addDateSet("expiresAt")
            .addStringSet("filename")
            .addNumberSet("filesize")
            .addStringSet("mimetype")
            .addStringSet("title");

        await conditions.executeTests((c, q) => c.files.getOwnFiles(q), ValidationSchema.Files);
    });

    test("peer files can be queried by their attributes", async () => {
        const file = await exchangeFile(client1, client2);
        const conditions = new QueryParamConditions(file, client2)
            .addDateSet("createdAt")
            .addDateSet("createdBy")
            .addDateSet("createdByDevice")
            .addDateSet("deletedAt")
            .addDateSet("deletedBy")
            .addDateSet("deletedByDevice")
            .addStringSet("description")
            .addDateSet("expiresAt")
            .addStringSet("filename")
            .addNumberSet("filesize")
            .addStringSet("mimetype")
            .addStringSet("title");

        await conditions.executeTests((c, q) => c.files.getPeerFiles(q), ValidationSchema.Files);
    });
});

describe("Load peer file with token reference", () => {
    let file: ConnectorFile;

    beforeAll(async () => {
        file = await uploadFile(client1);
    });

    test("before the peer file is loaded another client cannot access it", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFile(file.id);
        expectError(response, "File not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });

    test("peer file can be loaded with truncated token reference", async () => {
        expect(file).toBeDefined();

        const token = (await client1.files.createTokenForFile(file.id)).result;
        const response = await client2.files.loadPeerFile({ reference: token.truncatedReference });

        expectSuccess(response, ValidationSchema.File);
        expect(response.result).toMatchObject({ ...file, isOwn: false });
    });

    test("after peer file is loaded the file can be accessed under /Files/{id}", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFile(file.id);
        expectSuccess(response, ValidationSchema.File);
        expect(response.result).toMatchObject({ ...file, isOwn: false });
    });

    test("after peer file is loaded it can be accessed under /Files", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFiles({ createdAt: file.createdAt });
        expectSuccess(response, ValidationSchema.Files);
        expect(response.result).toContainEqual({ ...file, isOwn: false });
    });

    test("passing token id as truncated token reference causes an error", async () => {
        const file = await uploadFile(client1);
        const token = (await client1.files.createTokenForFile(file.id)).result;

        const response = await client2.files.loadPeerFile({ reference: token.id });
        expectError(response, "reference is invalid", "error.runtime.validation.invalidPropertyValue");
    });

    test("passing file id as truncated token reference causes an error", async () => {
        const file = await uploadFile(client1);

        const response = await client2.files.loadPeerFile({ reference: file.id });
        expectError(response, "reference is invalid", "error.runtime.validation.invalidPropertyValue");
    });

    test.each(illegalParameters)("passing %p as truncated token reference causes an error", async (tokenReference) => {
        const response = await client2.files.loadPeerFile({ reference: tokenReference as any });
        expectError(response, "The given combination of properties in the payload is not supported.", "error.runtime.validation.invalidPayload");
    });
});

describe("Load peer file with file id and secret", () => {
    let file: ConnectorFile;

    beforeAll(async () => {
        file = await uploadFile(client1);
    });

    test("before the peer file is loaded another client cannot access it", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFile(file.id);
        expectError(response, "File not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });

    test("peer file can be loaded with file id and secret key", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.loadPeerFile({ id: file.id, secretKey: file.secretKey });

        expectSuccess(response, ValidationSchema.File);
        expect(response.result).toMatchObject({ ...file, isOwn: false });
    });

    test("after peer file is loaded the file can be accessed under /Files/{id}", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFile(file.id);
        expectSuccess(response, ValidationSchema.File);
        expect(response.result).toMatchObject({ ...file, isOwn: false });
    });

    test("after peer file is loaded it can be accessed under /Files", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFiles({ createdAt: file.createdAt });
        expectSuccess(response, ValidationSchema.Files);
        expect(response.result).toContainEqual({ ...file, isOwn: false });
    });

    test("passing an unkown file id causes an error", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.loadPeerFile({ id: UNKOWN_FILE_ID, secretKey: file.secretKey });

        expectError(response, "File not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });

    test("passing an unkown token id as file id causes an error", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.loadPeerFile({ id: UNKOWN_TOKEN_ID, secretKey: file.secretKey });

        expectError(response, "id is invalid", "error.runtime.validation.invalidPropertyValue");
    });

    test.each(illegalParameters)("passing valid file id and %p as secret key", async (secretKey) => {
        const response = await client2.files.loadPeerFile({ id: file.id, secretKey: secretKey as any });

        expectError(response, "The given combination of properties in the payload is not supported.", "error.runtime.validation.invalidPayload");
    });

    test.each(illegalParameters)("passing %p as file id and valid secret key", async (fileId) => {
        const response = await client2.files.loadPeerFile({ id: fileId as any, secretKey: file.secretKey });

        expectError(response, "The given combination of properties in the payload is not supported.", "error.runtime.validation.invalidPayload");
    });

    test.each(combinations(illegalParameters, illegalParameters))("passing %p as file id and %p as secret key", async (fileId, secretKey) => {
        const response = await client2.files.loadPeerFile({ id: fileId as any, secretKey: secretKey as any });

        expectError(response, "The given combination of properties in the payload is not supported.", "error.runtime.validation.invalidPayload");
    });
});
