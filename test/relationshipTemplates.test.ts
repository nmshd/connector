import { ConnectorClient, ConnectorRelationshipTemplate } from "@nmshd/connector-sdk";
import { DateTime } from "luxon";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { createTemplate, exchangeTemplate } from "./lib/testUtils";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), 30000);
afterAll(() => launcher.stop());

describe("Template Tests", () => {
    let template: ConnectorRelationshipTemplate;
    let templateWithUndefinedMaxNumberOfAllocations: ConnectorRelationshipTemplate;

    test("create a template", async () => {
        const response = await client1.relationshipTemplates.createOwnRelationshipTemplate({
            maxNumberOfAllocations: 1,
            expiresAt: DateTime.utc().plus({ minutes: 10 }).toString(),
            content: { a: "b" }
        });

        expect(response).toBeSuccessful(ValidationSchema.RelationshipTemplate);

        template = response.result;
    });

    test("create a template with undefined maxNumberOfAllocations", async () => {
        const response = await client1.relationshipTemplates.createOwnRelationshipTemplate({
            content: { a: "A" },
            expiresAt: DateTime.utc().plus({ minutes: 1 }).toString()
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
            content: { a: "A" },
            expiresAt: DateTime.utc().plus({ minutes: 1 }).toString(),
            maxNumberOfAllocations: 0
        });

        expect(response.isError).toBeTruthy();
        expect(response.error.code).toBe("error.runtime.validation.invalidPropertyValue");
    });
});

describe("Serialization Errors", () => {
    test("create a template with wrong content : missing values", async () => {
        const response = await client1.relationshipTemplates.createOwnRelationshipTemplate({
            content: { a: "A", "@type": "Message" },
            expiresAt: DateTime.utc().plus({ minutes: 1 }).toString()
        });
        expect(response).toBeAnError("Message.secretKey :: Value is not defined", "error.runtime.requestDeserialization");
    });

    test("create a template with wrong content : not existent type", async () => {
        const response = await client1.relationshipTemplates.createOwnRelationshipTemplate({
            content: { a: "A", "@type": "NonExistentType" },
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
        const template = await createTemplate(client1);
        const conditions = new QueryParamConditions(template, client1)
            .addBooleanSet("isOwn")
            .addDateSet("createdAt")
            .addDateSet("expiresAt")
            .addStringSet("createdBy")
            .addStringSet("createdByDevice")
            .addNumberSet("maxNumberOfAllocations");

        await conditions.executeTests((c, q) => c.relationshipTemplates.getRelationshipTemplates(q), ValidationSchema.RelationshipTemplates);
    });

    test("query own templates", async () => {
        const template = await createTemplate(client1);
        const conditions = new QueryParamConditions(template, client1)
            .addDateSet("createdAt")
            .addDateSet("expiresAt")
            .addStringSet("createdBy")
            .addStringSet("createdByDevice")
            .addNumberSet("maxNumberOfAllocations");
        await conditions.executeTests((c, q) => c.relationshipTemplates.getOwnRelationshipTemplates(q), ValidationSchema.RelationshipTemplates);
    });

    test("query peer templates", async () => {
        const template = await exchangeTemplate(client1, client2);
        const conditions = new QueryParamConditions(template, client2)
            .addDateSet("createdAt")
            .addDateSet("expiresAt")
            .addStringSet("createdBy")
            .addStringSet("createdByDevice")
            .addNumberSet("maxNumberOfAllocations");

        await conditions.executeTests((c, q) => c.relationshipTemplates.getPeerRelationshipTemplates(q), ValidationSchema.RelationshipTemplates);
    });
});
