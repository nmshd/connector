import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { establishRelationship, getRelationship } from "./lib/testUtils";
import { expectError, expectSuccess, ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;
let client1Address: string;

let relationshipId: string;

beforeAll(async () => {
    console.log(new Date().valueOf(), new Date().toLocaleString(), "Launching"); // eslint-disable-line no-console
    [client1, client2] = await launcher.launch(2);
    console.log(new Date().valueOf(), new Date().toLocaleString(), "Establish relationship"); // eslint-disable-line no-console
    await establishRelationship(client1, client2);

    console.log(new Date().valueOf(), new Date().toLocaleString(), "Get Relationship"); // eslint-disable-line no-console
    relationshipId = (await getRelationship(client1)).id;
    console.log(new Date().valueOf(), new Date().toLocaleString(), "Get IdentityInfo"); // eslint-disable-line no-console
    client1Address = (await client1.account.getIdentityInfo()).result.address;
    console.log(new Date().valueOf(), new Date().toLocaleString(), "Done"); // eslint-disable-line no-console
}, 30000);
afterAll(() => launcher.stop());

describe("Create challenge", () => {
    test("should create a challenge with the Identity challenge type", async () => {
        const response = await client1.challenges.createChallenge({
            challengeType: "Identity"
        });
        expectSuccess(response, ValidationSchema.ConnectorChallenge);

        expect(response.result.type).toBe("Identity");
    });

    test("should create a challenge with the Device challenge type", async () => {
        const response = await client1.challenges.createChallenge({
            challengeType: "Device"
        });
        expectSuccess(response, ValidationSchema.ConnectorChallenge);

        expect(response.result.type).toBe("Device");
    });

    test("should create a challenge with the Relationship challenge type", async () => {
        const response = await client1.challenges.createChallenge({
            challengeType: "Relationship",
            relationship: relationshipId
        });
        expectSuccess(response, ValidationSchema.ConnectorChallenge);

        expect(response.result.type).toBe("Relationship");
    });
});

describe("Validate Challenge", () => {
    test("should validate a Relationship challenge", async () => {
        const response = await client1.challenges.createChallenge({
            challengeType: "Relationship",
            relationship: relationshipId
        });
        expectSuccess(response, ValidationSchema.ConnectorChallenge);
        expect(response.result.type).toBe("Relationship");

        const valid = await client2.challenges.validateChallenge({
            challenge: response.result.challengeString,
            signature: response.result.signature
        });
        expectSuccess(valid, ValidationSchema.ConnectorChallengeValidation);
        expect(valid.result.isValid).toBe(true);
        expect(valid.result.challengeCreatedBy).toBe(client1Address);
    });

    test("should validate a Identity challenge", async () => {
        const response = await client1.challenges.createChallenge({ challengeType: "Identity" });
        expectSuccess(response, ValidationSchema.ConnectorChallenge);
        expect(response.result.type).toBe("Identity");

        const valid = await client2.challenges.validateChallenge({
            challenge: response.result.challengeString,
            signature: response.result.signature
        });
        expectSuccess(valid, ValidationSchema.ConnectorChallengeValidation);
        expect(valid.result.isValid).toBe(true);
        expect(valid.result.challengeCreatedBy).toBe(client1Address);
    });

    test("challenge with the wrong signature is considered as not valid", async () => {
        const response = await client1.challenges.createChallenge({
            challengeType: "Relationship",
            relationship: relationshipId
        });
        expectSuccess(response, ValidationSchema.ConnectorChallenge);

        const response2 = await client1.challenges.createChallenge({
            challengeType: "Relationship",
            relationship: relationshipId
        });
        expectSuccess(response, ValidationSchema.ConnectorChallenge);

        const valid = await client2.challenges.validateChallenge({
            challenge: response.result.challengeString,
            signature: response2.result.signature
        });
        expectSuccess(valid, ValidationSchema.ConnectorChallengeValidation);
        expect(valid.result.isValid).toBe(false);
    });

    test("should validate a Device challenge", async () => {
        const response = await client1.challenges.createChallenge({ challengeType: "Device" });
        expectSuccess(response, ValidationSchema.ConnectorChallenge);
        expect(response.result.type).toBe("Device");

        const valid = await client2.challenges.validateChallenge({
            challenge: response.result.challengeString,
            signature: response.result.signature
        });
        expectError(valid, "Validating challenges of the type 'Device' is not yet implemented.", "error.runtime.featureNotImplemented");
    });
});
