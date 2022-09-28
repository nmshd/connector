import { ConnectorClient, ConnectorFile } from "@nmshd/connector-sdk";
import fs from "fs";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { exchangeFile, makeUploadRequest, uploadFile } from "./lib/testUtils";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

const UNKOWN_FILE_ID = "FILXXXXXXXXXXXXXXXXX";
const UNKOWN_TOKEN_ID = "TOKXXXXXXXXXXXXXXXXX";

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), 30000);
afterAll(() => launcher.stop());

describe("File Upload", () => {
    let file: ConnectorFile;

    test("can upload file", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest());

        expect(response).toBeSuccessful(ValidationSchema.File);

        file = response.result;
    });

    test("uploaded files can be accessed under /Files", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.getFiles({ createdAt: file.createdAt });
        expect(response).toBeSuccessful(ValidationSchema.Files);
        expect(response.result).toContainEqual(file);
    });

    test("uploaded files can be accessed under /Files/Own", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.getOwnFiles({ createdAt: file.createdAt });
        expect(response).toBeSuccessful(ValidationSchema.Files);
        expect(response.result).toContainEqual(file);
    });

    test("uploaded files can be accessed under /Files/{id}", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.getFile(file.id);
        expect(response).toBeSuccessful(ValidationSchema.File);
    });

    test("uploaded files keep their size", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.downloadFile(file.id);
        expect(response.isSuccess).toBeTruthy();
        expect(response.result.byteLength).toBe(4);
    });

    test("cannot upload an empty file", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ file: Buffer.of() }));
        expect(response).toBeAnError("'content' is empty", "error.runtime.validation.invalidPropertyValue");
    });

    test("cannot upload a file that is null", async () => {
        // Cannot use client1.files.uploadOwn because it cannot deal with null values
        const _response = await (client1.files as any).httpClient.post("/api/v2/Files/Own", makeUploadRequest({ file: null }));
        const response = (client1.files as any).makeResult(_response);

        expect(response).toBeAnError("must have required property 'content'", "error.runtime.validation.invalidPropertyValue");
    });
    test("can upload same file twice", async () => {
        const request = await makeUploadRequest({ file: await fs.promises.readFile(`${__dirname}/__assets__/test.txt`) });

        const response1 = await client1.files.uploadOwnFile(request);
        const response2 = await client1.files.uploadOwnFile(request);
        expect(response1).toBeSuccessful(ValidationSchema.File);
        expect(response2).toBeSuccessful(ValidationSchema.File);
    });

    test("file description is optional", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ description: "" }));
        expect(response).toBeSuccessful(ValidationSchema.File);
    });

    test("cannot upload a file with expiry date in the past", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ expiresAt: "1970-01-01T00:00:00.000Z" }));
        expect(response).toBeAnError("'expiresAt' must be in the future", "error.runtime.validation.invalidPropertyValue");
    });

    test("cannot upload a file with empty expiry date", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ expiresAt: "" }));
        expect(response).toBeAnError("expiresAt must match ISO8601 datetime format", "error.runtime.validation.invalidPropertyValue");
    });
});

describe("Get file", () => {
    test("can get file by id", async () => {
        const file = await uploadFile(client1);
        const response = await client1.files.getFile(file.id);

        expect(response).toBeSuccessful(ValidationSchema.File);
        expect(response.result).toMatchObject(file);
    });

    test("accessing not existing file id causes an error", async () => {
        const notPresentFileId = "FILXXXXXXXXXXXXXXXXX";
        const response = await client1.files.getFile(notPresentFileId);
        expect(response).toBeAnError("File not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });
});

describe("Files query", () => {
    test("files can be queried by their attributes", async () => {
        const file = await uploadFile(client1);
        const conditions = new QueryParamConditions(file, client1)
            .addDateSet("createdAt")
            .addDateSet("createdBy")
            .addDateSet("createdByDevice")
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
        expect(response).toBeAnError("File not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });

    test("peer file can be loaded with truncated token reference", async () => {
        expect(file).toBeDefined();

        const token = (await client1.files.createTokenForFile(file.id)).result;
        const response = await client2.files.loadPeerFile({ reference: token.truncatedReference });

        expect(response).toBeSuccessful(ValidationSchema.File);
        expect(response.result).toMatchObject({ ...file, isOwn: false });
    });

    test("after peer file is loaded the file can be accessed under /Files/{id}", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFile(file.id);
        expect(response).toBeSuccessful(ValidationSchema.File);
        expect(response.result).toMatchObject({ ...file, isOwn: false });
    });

    test("after peer file is loaded it can be accessed under /Files", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFiles({ createdAt: file.createdAt });
        expect(response).toBeSuccessful(ValidationSchema.Files);
        expect(response.result).toContainEqual({ ...file, isOwn: false });
    });

    test("passing token id as truncated token reference causes an error", async () => {
        const file = await uploadFile(client1);
        const token = (await client1.files.createTokenForFile(file.id)).result;

        const response = await client2.files.loadPeerFile({ reference: token.id });
        expect(response).toBeAnError("token / file reference invalid", "error.runtime.validation.invalidPropertyValue");
    });

    test("passing file id as truncated token reference causes an error", async () => {
        const file = await uploadFile(client1);

        const response = await client2.files.loadPeerFile({ reference: file.id });
        expect(response).toBeAnError("token / file reference invalid", "error.runtime.validation.invalidPropertyValue");
    });

    test.each([
        [null, "token / file reference invalid"],
        ["", "token / file reference invalid"]
    ])("passing %p as truncated token reference causes an error", async (tokenReference, expectedMessage) => {
        const response = await client2.files.loadPeerFile({ reference: tokenReference as any });
        expect(response).toBeAnError(expectedMessage, "error.runtime.validation.invalidPropertyValue");
    });

    test("passing undefined as truncated token reference causes an error", async () => {
        const response = await client2.files.loadPeerFile({ reference: undefined as any });
        expect(response).toBeAnError("The given combination of properties in the payload is not supported.", "error.runtime.validation.invalidPayload");
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
        expect(response).toBeAnError("File not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });

    test("peer file can be loaded with file id and secret key", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.loadPeerFile({ id: file.id, secretKey: file.secretKey });

        expect(response).toBeSuccessful(ValidationSchema.File);
        expect(response.result).toMatchObject({ ...file, isOwn: false });
    });

    test("after peer file is loaded the file can be accessed under /Files/{id}", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFile(file.id);
        expect(response).toBeSuccessful(ValidationSchema.File);
        expect(response.result).toMatchObject({ ...file, isOwn: false });
    });

    test("after peer file is loaded it can be accessed under /Files", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFiles({ createdAt: file.createdAt });
        expect(response).toBeSuccessful(ValidationSchema.Files);
        expect(response.result).toContainEqual({ ...file, isOwn: false });
    });

    test("passing an unkown file id causes an error", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.loadPeerFile({ id: UNKOWN_FILE_ID, secretKey: file.secretKey });

        expect(response).toBeAnError("File not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });

    test("passing an unkown token id as file id causes an error", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.loadPeerFile({ id: UNKOWN_TOKEN_ID, secretKey: file.secretKey });

        expect(response).toBeAnError("id must match pattern FIL.*", "error.runtime.validation.invalidPropertyValue");
    });

    test.each([
        [null, "secretKey must be string"],
        ["", "secretKey must NOT have fewer than 10 characters"]
    ])("cannot pass %p as secret key", async (secretKey, expectedMessage) => {
        const response = await client2.files.loadPeerFile({ id: file.id, secretKey: secretKey as any });

        expect(response).toBeAnError(expectedMessage, "error.runtime.validation.invalidPropertyValue");
    });

    test("cannot pass undefined as secret key", async () => {
        const response = await client2.files.loadPeerFile({ id: file.id, secretKey: undefined as any });

        expect(response).toBeAnError("The given combination of properties in the payload is not supported.", "error.runtime.validation.invalidPayload");
    });

    test.each([
        [null, "id must be string"],
        ["", "id must match pattern FIL.*"]
    ])("cannot pass %p as file id", async (fileId, expectedMessage) => {
        const response = await client2.files.loadPeerFile({ id: fileId as any, secretKey: file.secretKey });

        expect(response).toBeAnError(expectedMessage, "error.runtime.validation.invalidPropertyValue");
    });

    test("cannot pass undefined as file id", async () => {
        const response = await client2.files.loadPeerFile({ id: undefined as any, secretKey: file.secretKey });

        expect(response).toBeAnError("The given combination of properties in the payload is not supported.", "error.runtime.validation.invalidPayload");
    });

    test("get the File via the truncatedReference", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFile(file.truncatedReference);
        expect(response).toBeSuccessful(ValidationSchema.File);
        expect(response.result).toMatchObject({ ...file, isOwn: false });
    });
});
