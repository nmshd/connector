import { ConnectorClient } from "@nmshd/connector-sdk";
import { DateTime } from "luxon";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { getTimeout } from "./lib/setTimeout";
import { exchangeToken, uploadOwnToken } from "./lib/testUtils";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), getTimeout(30000));
afterAll(() => launcher.stop());

test("send a token", async () => {
    const response = await client1.tokens.createOwnToken({
        content: { aKey: "aValue" },
        expiresAt: DateTime.utc().plus({ days: 1 }).toString()
    });
    expect(response).toBeSuccessful();
});

test("load a token", async () => {
    const template = await uploadOwnToken(client1);

    const response = await client2.tokens.loadPeerToken({
        reference: template.reference.truncated
    });
    expect(response).toBeSuccessful();
});

test("send and receive a personalized token", async () => {
    const client2address = (await client2.account.getIdentityInfo()).result.address;
    const template = await uploadOwnToken(client1, client2address);
    expect(template.forIdentity).toBe(client2address);

    const response = await client2.tokens.loadPeerToken({
        reference: template.reference.truncated
    });
    expect(response).toBeSuccessful();
    expect(response.result.forIdentity).toBe(client2address);
});

test("send and receive a password-protected token", async () => {
    const token = await uploadOwnToken(client1, undefined, { password: "password" });
    expect(token.passwordProtection?.password).toBe("password");
    expect(token.passwordProtection?.passwordIsPin).toBeUndefined();

    const response = await client2.tokens.loadPeerToken({
        reference: token.reference.truncated,
        password: "password"
    });
    expect(response).toBeSuccessful();
    expect(response.result.passwordProtection?.password).toBe("password");
    expect(response.result.passwordProtection?.passwordIsPin).toBeUndefined();
});

test("send and receive a PIN-protected token", async () => {
    const token = await uploadOwnToken(client1, undefined, { password: "1234", passwordIsPin: true });
    expect(token.passwordProtection?.password).toBe("1234");
    expect(token.passwordProtection?.passwordIsPin).toBe(true);

    const response = await client2.tokens.loadPeerToken({
        reference: token.reference.truncated,
        password: "1234"
    });
    expect(response).toBeSuccessful();
    expect(response.result.passwordProtection?.password).toBe("1234");
    expect(response.result.passwordProtection?.passwordIsPin).toBe(true);
});

test("send and receive a password-protected token with PasswordLocationIndicator that is a string", async () => {
    const token = await uploadOwnToken(client1, undefined, { password: "password", passwordLocationIndicator: "Email" });
    expect(token.passwordProtection?.password).toBe("password");
    expect(token.passwordProtection?.passwordLocationIndicator).toBe("Email");

    const response = await client2.tokens.loadPeerToken({
        reference: token.reference.truncated,
        password: "password"
    });
    expect(response).toBeSuccessful();
    expect(response.result.passwordProtection?.password).toBe("password");
    expect(response.result.passwordProtection?.passwordLocationIndicator).toBe("Email");
});

test("send and receive a password-protected token with PasswordLocationIndicator that is a number", async () => {
    const token = await uploadOwnToken(client1, undefined, { password: "password", passwordLocationIndicator: 99 });
    expect(token.passwordProtection?.password).toBe("password");
    expect(token.passwordProtection?.passwordLocationIndicator).toBe(99);

    const response = await client2.tokens.loadPeerToken({
        reference: token.reference.truncated,
        password: "password"
    });
    expect(response).toBeSuccessful();
    expect(response.result.passwordProtection?.password).toBe("password");
    expect(response.result.passwordProtection?.passwordLocationIndicator).toBe(99);
});

test("cannot set an invalid string as PasswordLocationIndicator", async () => {
    const passwordProtection = { password: "password", passwordLocationIndicator: "invalidPasswordLocationIndicator" as any };

    const response = await client1.tokens.createOwnToken({
        content: { aKey: "aValue" },
        expiresAt: DateTime.utc().plus({ days: 1 }).toString(),
        passwordProtection
    });

    expect(response.isSuccess).toBe(false);
    expect(response.error.message).toBe("must be a number from 50 to 99 or one of the following strings: Self, Letter, RegistrationLetter, Email, SMS, Website");
});

test("cannot set an invalid number as PasswordLocationIndicator", async () => {
    const passwordProtection = { password: "password", passwordLocationIndicator: 1000 as any };

    const response = await client1.tokens.createOwnToken({
        content: { aKey: "aValue" },
        expiresAt: DateTime.utc().plus({ days: 1 }).toString(),
        passwordProtection
    });

    expect(response.isSuccess).toBe(false);
    expect(response.error.message).toBe("must be a number from 50 to 99 or one of the following strings: Self, Letter, RegistrationLetter, Email, SMS, Website");
});

describe("Tokens query", () => {
    test("query own tokens", async () => {
        const token = await uploadOwnToken(client1, (await client1.account.getIdentityInfo()).result.address, { password: "password", passwordLocationIndicator: 50 });
        const conditions = new QueryParamConditions(token, client1)
            .addDateSet("expiresAt")
            .addDateSet("createdAt")
            .addStringSet("createdByDevice")
            .addStringSet("forIdentity")
            .addSingleCondition({
                expectedResult: true,
                key: "passwordProtection",
                value: ""
            })
            .addSingleCondition({
                expectedResult: false,
                key: "passwordProtection",
                value: "!"
            })
            .addStringSet("passwordProtection.password")
            .addSingleCondition({
                expectedResult: false,
                key: "passwordProtection.passwordIsPin",
                value: "true"
            })
            .addSingleCondition({
                expectedResult: true,
                key: "passwordProtection.passwordIsPin",
                value: "!"
            })
            .addSingleCondition({
                expectedResult: true,
                key: "passwordProtection.passwordLocationIndicator",
                value: "50"
            })
            .addSingleCondition({
                expectedResult: false,
                key: "passwordProtection.passwordLocationIndicator",
                value: "Self"
            });
        await conditions.executeTests((c, q) => c.tokens.getOwnTokens(q));
    });

    test("query own PIN-protected tokens", async () => {
        const token = await uploadOwnToken(client1, (await client1.account.getIdentityInfo()).result.address, {
            password: "1234",
            passwordIsPin: true,
            passwordLocationIndicator: "Email"
        });
        const conditions = new QueryParamConditions(token, client1)
            .addStringSet("passwordProtection.password")
            .addSingleCondition({
                expectedResult: true,
                key: "passwordProtection.passwordIsPin",
                value: "true"
            })
            .addSingleCondition({
                expectedResult: false,
                key: "passwordProtection.passwordIsPin",
                value: "!"
            })
            .addSingleCondition({
                expectedResult: true,
                key: "passwordProtection.passwordLocationIndicator",
                value: "Email"
            })
            .addSingleCondition({
                expectedResult: false,
                key: "passwordProtection.passwordLocationIndicator",
                value: "SMS"
            });
        await conditions.executeTests((c, q) => c.tokens.getOwnTokens(q));
    });

    test("query peer tokens", async () => {
        const token = await exchangeToken(client1, client2, (await client2.account.getIdentityInfo()).result.address);
        const conditions = new QueryParamConditions(token, client2)
            .addDateSet("expiresAt")
            .addDateSet("createdAt")
            .addStringSet("createdBy")
            .addStringSet("forIdentity")
            .addSingleCondition({
                expectedResult: false,
                key: "passwordProtection",
                value: ""
            })
            .addSingleCondition({
                expectedResult: true,
                key: "passwordProtection",
                value: "!"
            });
        await conditions.executeTests((c, q) => c.tokens.getPeerTokens(q));
    });
});
