import { ConnectorClient } from "@nmshd/connector-sdk";
import { FileDTO } from "@nmshd/runtime-types";
import fs from "fs";
import { DateTime } from "luxon";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { getTimeout } from "./lib/setTimeout";
import { exchangeFile, makeUploadRequest, uploadFile } from "./lib/testUtils";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), getTimeout(30000));
afterAll(() => launcher.stop());

describe("File Upload", () => {
    let file: FileDTO;

    test("can upload file", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest());

        expect(response).toBeSuccessful();

        file = response.result;
    });

    test("can upload file with umlaut in title and filename", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ title: "ÄÖÜ", filename: "ÄÖÜ.txt" }));

        expect(response).toBeSuccessful();

        const file = response.result;
        expect(file.title).toBe("ÄÖÜ");
        expect(file.filename).toBe("ÄÖÜ.txt");
    });

    test("can upload file with space in title and filename", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ title: "a file", filename: "a file.txt" }));

        expect(response).toBeSuccessful();

        const file = response.result;
        expect(file.title).toBe("a file");
        expect(file.filename).toBe("a file.txt");
    });

    test("can upload file without description", async () => {
        const response = await client1.files.uploadOwnFile({
            title: "File Title",
            filename: "test.txt",
            file: await fs.promises.readFile(`${__dirname}/__assets__/test.txt`),
            expiresAt: DateTime.utc().plus({ minutes: 5 }).toString()
        });

        expect(response).toBeSuccessful();
    });

    test("uploaded files can be accessed under /Files", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.getFiles({ createdAt: file.createdAt });
        expect(response).toBeSuccessful();
        expect(response.result).toContainEqual(file);
    });

    test("uploaded files can be accessed under /Files/Own", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.getOwnFiles({ createdAt: file.createdAt });
        expect(response).toBeSuccessful();
        expect(response.result).toContainEqual(file);
    });

    test("uploaded files can be accessed under /Files/{id}", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.getFile(file.id);
        expect(response).toBeSuccessful();
    });

    test("uploaded files keep their size", async () => {
        expect(file).toBeDefined();

        const response = await client1.files.downloadFile(file.id);
        expect(response.isSuccess).toBeTruthy();
        expect(response.result.byteLength).toBe(4);
    });

    test("can upload an empty file", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ file: Buffer.of() }));
        expect(response).toBeSuccessful();

        const downloadResponse = await client1.files.downloadFile(response.result.id);
        expect(downloadResponse.isSuccess).toBeTruthy();
        expect(downloadResponse.result.byteLength).toBe(0);
    });

    test("cannot upload a file that is null", async () => {
        // Cannot use client1.files.uploadOwn because it cannot deal with null values
        const _response = await (client1.files as any).httpClient.post("/api/v2/Files/Own", makeUploadRequest({ file: null as any }));
        const response = (client1.files as any).makeResult(_response);

        expect(response).toBeAnError("must have required property 'content'", "error.runtime.validation.invalidPropertyValue");
    });

    test("can upload same file twice", async () => {
        const request = await makeUploadRequest({ file: await fs.promises.readFile(`${__dirname}/__assets__/test.txt`) });

        const response1 = await client1.files.uploadOwnFile(request);
        const response2 = await client1.files.uploadOwnFile(request);
        expect(response1).toBeSuccessful();
        expect(response2).toBeSuccessful();
    });

    test("file description is optional", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ description: "" }));
        expect(response).toBeSuccessful();
    });

    test("can upload file with tags", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest({ tags: ["tag1", "tag2"] }));
        expect(response).toBeSuccessful();
        expect(response.result.tags).toStrictEqual(["tag1", "tag2"]);
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

        expect(response).toBeSuccessful();
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

        await conditions.executeTests((c, q) => c.files.getFiles(q));
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

        await conditions.executeTests((c, q) => c.files.getOwnFiles(q));
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

        await conditions.executeTests((c, q) => c.files.getPeerFiles(q));
    });
});

describe("Load peer file with token reference", () => {
    let file: FileDTO;

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
        const response = await client2.files.loadPeerFile({ reference: token.reference.truncated });

        expect(response).toBeSuccessful();
        expect(response.result).toStrictEqualExcluding({ ...file, isOwn: false, ownershipToken: undefined }, "ownershipToken");
    });

    test("after peer file is loaded the file can be accessed under /Files/{id}", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFile(file.id);
        expect(response).toBeSuccessful();
        expect(response.result).toStrictEqualExcluding({ ...file, isOwn: false, ownershipToken: undefined }, "ownershipToken");
    });

    test("after peer file is loaded it can be accessed under /Files", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFiles({ createdAt: file.createdAt });
        expect(response).toBeSuccessful();
        expect(response.result).toContainEqual({ ...file, isOwn: false, ownershipToken: undefined });
    });

    test("token can be personalized", async () => {
        const client2address = (await client2.account.getIdentityInfo()).result.address;
        const token = (await client1.files.createTokenForFile(file.id, { forIdentity: client2address })).result;
        expect(token.forIdentity).toBe(client2address);

        const response = await client2.files.loadPeerFile({ reference: token.reference.truncated });
        expect(response).toBeSuccessful();
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
        expect(response).toBeAnError("token / file reference invalid", "error.runtime.validation.invalidPropertyValue");
    });
});

describe("Load peer file with reference", () => {
    let file: FileDTO;

    beforeAll(async () => {
        file = await uploadFile(client1);
    });

    test("before the peer file is loaded another client cannot access it", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFile(file.id);
        expect(response).toBeAnError("File not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });

    test("peer file can be loaded", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.loadPeerFile({ reference: file.reference.truncated });

        expect(response).toBeSuccessful();
        expect(response.result).toStrictEqualExcluding({ ...file, isOwn: false, ownershipToken: undefined }, "ownershipToken");
    });

    test("after peer file is loaded the file can be accessed under /Files/{id}", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFile(file.id);
        expect(response).toBeSuccessful();
        expect(response.result).toStrictEqualExcluding({ ...file, isOwn: false, ownershipToken: undefined }, "ownershipToken");
    });

    test("after peer file is loaded it can be accessed under /Files", async () => {
        expect(file).toBeDefined();

        const response = await client2.files.getFiles({ createdAt: file.createdAt });
        expect(response).toBeSuccessful();
        expect(response.result).toContainEqual({ ...file, isOwn: false, ownershipToken: undefined });
    });
});

describe("Password-protected tokens for files", () => {
    test("send and receive an unprotected file via password-protected token", async () => {
        const file = await uploadFile(client1);
        const token = (await client1.files.createTokenForFile(file.id, { passwordProtection: { password: "password" } })).result;
        expect(token.passwordProtection?.password).toBe("password");
        expect(token.passwordProtection?.passwordIsPin).toBeUndefined();

        const response = await client2.files.loadPeerFile({ reference: token.reference.truncated, password: "password" });
        expect(response).toBeSuccessful();
    });

    test("send and receive an unprotected file via PIN-protected token", async () => {
        const file = await uploadFile(client1);
        const token = (await client1.files.createTokenForFile(file.id, { passwordProtection: { password: "1234", passwordIsPin: true } })).result;
        expect(token.passwordProtection?.password).toBe("1234");
        expect(token.passwordProtection?.passwordIsPin).toBe(true);

        const response = await client2.files.loadPeerFile({ reference: token.reference.truncated, password: "1234" });
        expect(response).toBeSuccessful();
    });

    test("send and receive an unprotected file via PIN-protected token with PasswordLocationIndicator that is a string", async () => {
        const file = await uploadFile(client1);
        const token = (await client1.files.createTokenForFile(file.id, { passwordProtection: { password: "1234", passwordIsPin: true, passwordLocationIndicator: "Self" } }))
            .result;
        expect(token.passwordProtection?.password).toBe("1234");
        expect(token.passwordProtection?.passwordIsPin).toBe(true);
        expect(token.passwordProtection?.passwordLocationIndicator).toBe("Self");

        const response = await client2.files.loadPeerFile({ reference: token.reference.truncated, password: "1234" });
        expect(response).toBeSuccessful();
    });

    test("send and receive an unprotected file via PIN-protected token with PasswordLocationIndicator that is a number", async () => {
        const file = await uploadFile(client1);
        const token = (await client1.files.createTokenForFile(file.id, { passwordProtection: { password: "1234", passwordIsPin: true, passwordLocationIndicator: 51 } })).result;
        expect(token.passwordProtection?.password).toBe("1234");
        expect(token.passwordProtection?.passwordIsPin).toBe(true);
        expect(token.passwordProtection?.passwordLocationIndicator).toBe(51);

        const response = await client2.files.loadPeerFile({ reference: token.reference.truncated, password: "1234" });
        expect(response).toBeSuccessful();
    });
});

describe("Delete file", () => {
    test("delete a file", async () => {
        const file = (await client1.files.uploadOwnFile(await makeUploadRequest())).result;

        const getFileResult = await client1.files.getFile(file.id);
        expect(getFileResult).toBeSuccessful();

        const deleteFileResult = await client1.files.deleteFile(file.id);
        expect(deleteFileResult).toBeSuccessfulVoidResult();

        const getFileAfterDeletionResult = await client1.files.getFile(file.id);
        expect(getFileAfterDeletionResult).toBeAnError("File not found. Make sure the ID exists and the record is not expired.", "error.runtime.recordNotFound");
    });
});

describe("File ownership", () => {
    test("ownership token is returned when uploading a file", async () => {
        const response = await client1.files.uploadOwnFile(await makeUploadRequest());

        expect(response).toBeSuccessful();
        expect(response.result.ownershipToken).toBeDefined();
    });

    test("ownership token can be regenerated", async () => {
        const file = await uploadFile(client1);
        const initialOwnershipToken = file.ownershipToken;

        const regenerateResponse = await client1.files.regenerateFileOwnershipToken(file.id);

        expect(regenerateResponse).toBeSuccessful();
        expect(regenerateResponse.result.ownershipToken).toBeDefined();
        expect(regenerateResponse.result.ownershipToken).not.toBe(initialOwnershipToken);
    });
});
