import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { getTimeout } from "./lib/setTimeout";
import { establishRelationship, getRelationship } from "./lib/testUtils";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;
let client1Address: string;

let relationshipId: string;

beforeAll(async () => {
    [client1, client2] = await launcher.launch(2);
    await establishRelationship(client1, client2);

    relationshipId = (await getRelationship(client1)).id;
    client1Address = (await client1.account.getIdentityInfo()).result.address;
}, getTimeout(30000));
afterAll(() => launcher.stop());

describe("Create challenge", () => {
    test("should create a challenge with the Identity challenge type", async () => {
        const response = await client1.challenges.createChallenge({
            challengeType: "Identity"
        });
        expect(response).toBeSuccessful();

        expect(response.result.type).toBe("Identity");
    });

    test("should create a challenge with the Device challenge type", async () => {
        const response = await client1.challenges.createChallenge({
            challengeType: "Device"
        });
        expect(response).toBeSuccessful();

        expect(response.result.type).toBe("Device");
    });

    test("should create a challenge with the Relationship challenge type", async () => {
        const response = await client1.challenges.createChallenge({
            challengeType: "Relationship",
            relationship: relationshipId
        });
        expect(response).toBeSuccessful();

        expect(response.result.type).toBe("Relationship");
    });
});

describe("Validate Challenge", () => {
    test("should validate a Relationship challenge", async () => {
        const response = await client1.challenges.createChallenge({
            challengeType: "Relationship",
            relationship: relationshipId
        });
        expect(response).toBeSuccessful();
        expect(response.result.type).toBe("Relationship");

        const validationResult = await client2.challenges.validateChallenge({
            challengeString: response.result.challengeString,
            signature: response.result.signature
        });
        expect(validationResult).toBeSuccessful();
        expect(validationResult.result.isValid).toBe(true);
        expect(validationResult.result.correspondingRelationship?.peer).toBe(client1Address);
    });

    test("should validate a Identity challenge", async () => {
        const response = await client1.challenges.createChallenge({ challengeType: "Identity" });
        expect(response).toBeSuccessful();
        expect(response.result.type).toBe("Identity");

        const validationResult = await client2.challenges.validateChallenge({
            challengeString: response.result.challengeString,
            signature: response.result.signature
        });
        expect(validationResult).toBeSuccessful();
        expect(validationResult.result.isValid).toBe(true);
        expect(validationResult.result.correspondingRelationship?.peer).toBe(client1Address);
    });

    test("challenge with the wrong signature is considered as not valid", async () => {
        const response = await client1.challenges.createChallenge({
            challengeType: "Relationship",
            relationship: relationshipId
        });
        expect(response).toBeSuccessful();

        const response2 = await client1.challenges.createChallenge({
            challengeType: "Relationship",
            relationship: relationshipId
        });
        expect(response).toBeSuccessful();

        const validationResult = await client2.challenges.validateChallenge({
            challengeString: response.result.challengeString,
            signature: response2.result.signature
        });
        expect(validationResult).toBeSuccessful();
        expect(validationResult.result.isValid).toBe(false);
    });

    test("should validate a Device challenge", async () => {
        const response = await client1.challenges.createChallenge({ challengeType: "Device" });
        expect(response).toBeSuccessful();
        expect(response.result.type).toBe("Device");

        const validationResult = await client2.challenges.validateChallenge({
            challengeString: response.result.challengeString,
            signature: response.result.signature
        });
        expect(validationResult).toBeAnError("Validating challenges of the type 'Device' is not yet supported.", "error.runtime.notSupported");
    });
});
