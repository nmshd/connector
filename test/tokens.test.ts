import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { exchangeToken, uploadOwnToken } from "./lib/testUtils";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), 30000);
afterAll(() => launcher.stop());

describe("Tokens query", () => {
    test("query own tokens", async () => {
        const token = await uploadOwnToken(client1);
        const conditions = new QueryParamConditions(token, client1).addDateSet("expiresAt").addDateSet("createdAt").addStringSet("createdByDevice");
        await conditions.executeTests((c, q) => c.tokens.getOwnTokens(q), ValidationSchema.Tokens);
    });

    test("query peer tokens", async () => {
        const token = await exchangeToken(client1, client2);
        const conditions = new QueryParamConditions(token, client2).addDateSet("expiresAt").addDateSet("createdAt").addStringSet("createdBy");
        await conditions.executeTests((c, q) => c.tokens.getPeerTokens(q), ValidationSchema.Tokens);
    });
});
