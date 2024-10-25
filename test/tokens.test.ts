import { ConnectorClient } from "@nmshd/connector-sdk";
import { DateTime } from "luxon";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { getTimeout } from "./lib/setTimeout";
import { exchangeToken, uploadOwnToken } from "./lib/testUtils";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), getTimeout(30000));
afterAll(() => launcher.stop());

test("send a token", async () => {
    const response = await client1.tokens.createOwnToken({
        content: {
            content: "Hello"
        },
        expiresAt: DateTime.utc().plus({ days: 1 }).toString()
    });

    expect(response).toBeSuccessful(ValidationSchema.Token);
});

test("load a token", async () => {
    const template = await uploadOwnToken(client1);

    const response = await client2.tokens.loadPeerToken({
        reference: template.truncatedReference
    });
    expect(response).toBeSuccessful(ValidationSchema.Token);
});

test("send and receive a personalized token", async () => {
    const template = await uploadOwnToken(client1, (await client2.account.getIdentityInfo()).result.address);

    const response = await client2.tokens.loadPeerToken({
        reference: template.truncatedReference
    });
    expect(response).toBeSuccessful(ValidationSchema.Token);
});

describe("Tokens query", () => {
    test("query own tokens", async () => {
        const token = await uploadOwnToken(client1, (await client1.account.getIdentityInfo()).result.address);
        const conditions = new QueryParamConditions(token, client1).addDateSet("expiresAt").addDateSet("createdAt").addStringSet("createdByDevice").addStringSet("forIdentity");
        await conditions.executeTests((c, q) => c.tokens.getOwnTokens(q), ValidationSchema.Tokens);
    });

    test("query peer tokens", async () => {
        const token = await exchangeToken(client1, client2, (await client2.account.getIdentityInfo()).result.address);
        const conditions = new QueryParamConditions(token, client2).addDateSet("expiresAt").addDateSet("createdAt").addStringSet("createdBy").addStringSet("forIdentity");
        await conditions.executeTests((c, q) => c.tokens.getPeerTokens(q), ValidationSchema.Tokens);
    });
});
