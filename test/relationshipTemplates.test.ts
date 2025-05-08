import { ConnectorClient, ConnectorRelationshipTemplate } from "@nmshd/connector-sdk";
import { DateTime } from "luxon";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { getTimeout } from "./lib/setTimeout";
import { createTemplate, exchangeTemplate, getTemplateToken } from "./lib/testUtils";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), getTimeout(30000));
afterAll(() => launcher.stop());

describe("Template Tests", () => {
    let template: ConnectorRelationshipTemplate;
    let templateWithUndefinedMaxNumberOfAllocations: ConnectorRelationshipTemplate;

    test("create a template", async () => {
        const response = await client1.relationshipTemplates.createOwnRelationshipTemplate({
            maxNumberOfAllocations: 1,
            expiresAt: DateTime.utc().plus({ minutes: 10 }).toString(),
            content: {
                "@type": "ArbitraryRelationshipTemplateContent",
                value: { a: "b" }
            }
        });

        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);

        template = response.result;
    });

    test("create a template with undefined maxNumberOfAllocations", async () => {
        const response = await client1.relationshipTemplates.createOwnRelationshipTemplate({
            content: {
                "@type": "ArbitraryRelationshipTemplateContent",
                value: { a: "b" }
            },
            expiresAt: DateTime.utc().plus({ minutes: 10 }).toString()
        });

        templateWithUndefinedMaxNumberOfAllocations = response.result;

        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(templateWithUndefinedMaxNumberOfAllocations.maxNumberOfAllocations).toBeUndefined();
    });

    test("read a template with undefined maxNumberOfAllocations", async () => {
        const response = await client1.relationshipTemplates.getRelationshipTemplate(templateWithUndefinedMaxNumberOfAllocations.id);

        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.maxNumberOfAllocations).toBeUndefined();
    });

    test("see If template exists in /RelationshipTemplates/Own", async () => {
        expect(template).toBeDefined();

        const response = await client1.relationshipTemplates.getOwnRelationshipTemplates();
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplates);
        expect(response.result).toContainEqual(template);
    });

    test("see If template exists in /RelationshipTemplates/{id}", async () => {
        expect(template).toBeDefined();

        const response = await client1.relationshipTemplates.getRelationshipTemplate(template.id);
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
    });

    test("expect a validation error for sending maxNumberOfAllocations 0", async () => {
        const response = await client1.relationshipTemplates.createOwnRelationshipTemplate({
            content: {
                "@type": "ArbitraryRelationshipTemplateContent",
                value: { a: "A" }
            },
            expiresAt: DateTime.utc().plus({ minutes: 1 }).toString(),
            maxNumberOfAllocations: 0
        });

        expect(response.isError).toBeTruthy();
        expect(response.error.code).toBe("error.runtime.validation.invalidPropertyValue");
    });

    test("send and receive a personalized template", async () => {
        const client2address = (await client2.account.getIdentityInfo()).result.address;
        const template = await createTemplate(client1, client2address);
        expect(template.forIdentity).toBe(client2address);

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: template.reference.truncated
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.forIdentity).toBe(client2address);
    });

    test("send and receive a personalized template via token", async () => {
        const client2address = (await client2.account.getIdentityInfo()).result.address;
        const templateToken = await getTemplateToken(client1, client2address);

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: templateToken.reference.truncated
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.forIdentity).toBe(client2address);
    });

    test("send and receive a non-personalized template via personalized token", async () => {
        const client2address = (await client2.account.getIdentityInfo()).result.address;
        const template = await createTemplate(client1, client2address);
        const token = (await client1.relationshipTemplates.createTokenForOwnRelationshipTemplate(template.id, { forIdentity: client2address })).result;

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: token.reference.truncated
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.forIdentity).toBe(client2address);
    });

    test("send and receive a password-protected template", async () => {
        const template = await createTemplate(client1, undefined, { password: "password" });
        expect(template.passwordProtection?.password).toBe("password");
        expect(template.passwordProtection?.passwordIsPin).toBeUndefined();

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: template.reference.truncated,
            password: "password"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.passwordProtection?.password).toBe("password");
        expect(response.result.passwordProtection?.passwordIsPin).toBeUndefined();
    });

    test("send and receive a PIN-protected template", async () => {
        const template = await createTemplate(client1, undefined, { password: "1234", passwordIsPin: true });
        expect(template.passwordProtection?.password).toBe("1234");
        expect(template.passwordProtection?.passwordIsPin).toBe(true);

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: template.reference.truncated,
            password: "1234"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.passwordProtection?.password).toBe("1234");
        expect(response.result.passwordProtection?.passwordIsPin).toBe(true);
    });

    test("send and receive a password-protected template with PasswordLocationIndicator that is a string", async () => {
        const template = await createTemplate(client1, undefined, { password: "password", passwordLocationIndicator: "Website" });
        expect(template.passwordProtection?.password).toBe("password");
        expect(template.passwordProtection?.passwordLocationIndicator).toBe("Website");

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: template.reference.truncated,
            password: "password"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.passwordProtection?.password).toBe("password");
        expect(response.result.passwordProtection?.passwordIsPin).toBeUndefined();
        expect(response.result.passwordProtection?.passwordLocationIndicator).toBe("Website");
    });

    test("send and receive a password-protected template with PasswordLocationIndicator that is a number", async () => {
        const template = await createTemplate(client1, undefined, { password: "password", passwordLocationIndicator: 50 });
        expect(template.passwordProtection?.password).toBe("password");
        expect(template.passwordProtection?.passwordLocationIndicator).toBe(50);

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: template.reference.truncated,
            password: "password"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.passwordProtection?.password).toBe("password");
        expect(response.result.passwordProtection?.passwordIsPin).toBeUndefined();
        expect(response.result.passwordProtection?.passwordLocationIndicator).toBe(50);
    });

    test("send and receive a password-protected template via token", async () => {
        const templateToken = await getTemplateToken(client1, undefined, { password: "password" });
        expect(templateToken.passwordProtection?.password).toBe("password");
        expect(templateToken.passwordProtection?.passwordIsPin).toBeUndefined();

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: templateToken.reference.truncated,
            password: "password"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.passwordProtection?.password).toBe("password");
        expect(response.result.passwordProtection?.passwordIsPin).toBeUndefined();
    });

    test("send and receive a PIN-protected template via token", async () => {
        const templateToken = await getTemplateToken(client1, undefined, { password: "1234", passwordIsPin: true });
        expect(templateToken.passwordProtection?.password).toBe("1234");
        expect(templateToken.passwordProtection?.passwordIsPin).toBe(true);

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: templateToken.reference.truncated,
            password: "1234"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.passwordProtection?.password).toBe("1234");
        expect(response.result.passwordProtection?.passwordIsPin).toBe(true);
    });

    test("send and receive a password-protected template via token with PasswordLocationIndicator that is a string", async () => {
        const templateToken = await getTemplateToken(client1, undefined, { password: "password", passwordLocationIndicator: "Website" });
        expect(templateToken.passwordProtection?.password).toBe("password");
        expect(templateToken.passwordProtection?.passwordLocationIndicator).toBe("Website");

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: templateToken.reference.truncated,
            password: "password"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.passwordProtection?.password).toBe("password");
        expect(response.result.passwordProtection?.passwordLocationIndicator).toBe("Website");
    });

    test("send and receive a password-protected template via token with PasswordLocationIndicator that is a number", async () => {
        const templateToken = await getTemplateToken(client1, undefined, { password: "password", passwordLocationIndicator: 50 });
        expect(templateToken.passwordProtection?.password).toBe("password");
        expect(templateToken.passwordProtection?.passwordLocationIndicator).toBe(50);

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: templateToken.reference.truncated,
            password: "password"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        expect(response.result.passwordProtection?.password).toBe("password");
        expect(response.result.passwordProtection?.passwordLocationIndicator).toBe(50);
    });

    test("send and receive an unprotected template via password-protected token", async () => {
        const template = await createTemplate(client1);
        const token = (await client1.relationshipTemplates.createTokenForOwnRelationshipTemplate(template.id, { passwordProtection: { password: "password" } })).result;
        expect(token.passwordProtection?.password).toBe("password");
        expect(token.passwordProtection?.passwordIsPin).toBeUndefined();

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: token.reference.truncated,
            password: "password"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
    });

    test("send and receive an unprotected template via PIN-protected token", async () => {
        const template = await createTemplate(client1);
        const token = (await client1.relationshipTemplates.createTokenForOwnRelationshipTemplate(template.id, { passwordProtection: { password: "1234", passwordIsPin: true } }))
            .result;
        expect(token.passwordProtection?.password).toBe("1234");
        expect(token.passwordProtection?.passwordIsPin).toBe(true);

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: token.reference.truncated,
            password: "1234"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
    });

    test("send and receive an unprotected template via password-protected token with PasswordLocationIndicator that is a string", async () => {
        const template = await createTemplate(client1);
        const token = (
            await client1.relationshipTemplates.createTokenForOwnRelationshipTemplate(template.id, {
                passwordProtection: { password: "password", passwordLocationIndicator: "Website" }
            })
        ).result;
        expect(token.passwordProtection?.password).toBe("password");
        expect(token.passwordProtection?.passwordLocationIndicator).toBe("Website");

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: token.reference.truncated,
            password: "password"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
    });

    test("send and receive an unprotected template via password-protected token with PasswordLocationIndicator that is a number", async () => {
        const template = await createTemplate(client1);
        const token = (
            await client1.relationshipTemplates.createTokenForOwnRelationshipTemplate(template.id, {
                passwordProtection: { password: "password", passwordLocationIndicator: 50 }
            })
        ).result;
        expect(token.passwordProtection?.password).toBe("password");
        expect(token.passwordProtection?.passwordLocationIndicator).toBe(50);

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: token.reference.truncated,
            password: "password"
        });
        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);
    });
});

describe("Serialization Errors", () => {
    test("create a template with wrong content : missing values", async () => {
        const response = await client1.relationshipTemplates.createOwnRelationshipTemplate({
            content: { a: "A", "@type": "Message" } as any,
            expiresAt: DateTime.utc().plus({ minutes: 1 }).toString()
        });
        expect(response).toBeAnError("Message.secretKey :: Value is not defined", "error.runtime.requestDeserialization");
    });

    test("create a template with wrong content : not existent type", async () => {
        const response = await client1.relationshipTemplates.createOwnRelationshipTemplate({
            content: { a: "A", "@type": "NonExistentType" } as any,
            expiresAt: DateTime.utc().plus({ minutes: 1 }).toString()
        });
        expect(response).toBeAnError(
            "Type 'NonExistentType' with version 1 was not found within reflection classes. You might have to install a module first.",
            "error.runtime.unknownType"
        );
    });
});

describe("RelationshipTemplates Query", () => {
    test("query templates", async () => {
        const template = await createTemplate(client1, (await client1.account.getIdentityInfo()).result.address, {
            password: "password",
            passwordLocationIndicator: "RegistrationLetter"
        });
        const conditions = new QueryParamConditions(template, client1)
            .addBooleanSet("isOwn")
            .addDateSet("createdAt")
            .addDateSet("expiresAt")
            .addStringSet("createdBy")
            .addStringSet("createdByDevice")
            .addNumberSet("maxNumberOfAllocations")
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
                value: "RegistrationLetter"
            })
            .addSingleCondition({
                expectedResult: false,
                key: "passwordProtection.passwordLocationIndicator",
                value: "differentLocationIndicator"
            });

        await conditions.executeTests((c, q) => c.relationshipTemplates.getRelationshipTemplates(q), ValidationSchema.RelationshipTemplates);
    });

    test("query own templates", async () => {
        const template = await createTemplate(client1, (await client1.account.getIdentityInfo()).result.address, {
            password: "1234",
            passwordIsPin: true,
            passwordLocationIndicator: 99
        });
        const conditions = new QueryParamConditions(template, client1)
            .addDateSet("createdAt")
            .addDateSet("expiresAt")
            .addStringSet("createdBy")
            .addStringSet("createdByDevice")
            .addNumberSet("maxNumberOfAllocations")
            .addStringSet("forIdentity")
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
                value: 99
            })
            .addSingleCondition({
                expectedResult: false,
                key: "passwordProtection.passwordLocationIndicator",
                value: 50
            });
        await conditions.executeTests((c, q) => c.relationshipTemplates.getOwnRelationshipTemplates(q), ValidationSchema.RelationshipTemplates);
    });

    test("query peer templates", async () => {
        const template = await exchangeTemplate(client1, client2, (await client2.account.getIdentityInfo()).result.address);
        const conditions = new QueryParamConditions(template, client2)
            .addDateSet("createdAt")
            .addDateSet("expiresAt")
            .addStringSet("createdBy")
            .addStringSet("createdByDevice")
            .addNumberSet("maxNumberOfAllocations")
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

        await conditions.executeTests((c, q) => c.relationshipTemplates.getPeerRelationshipTemplates(q), ValidationSchema.RelationshipTemplates);
    });
});
