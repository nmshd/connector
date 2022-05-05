import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { getRelationship, getTemplateToken, syncUntilHasRelationships } from "./lib/testUtils";
import { expectSuccess, ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), 30000);
afterAll(() => launcher.stop());

describe("Create Relationship", () => {
    let templateId: string;
    let relationshipId: string;
    let relationshipChangeId: string;

    test("load relationship Template in connector 2", async () => {
        const token = await getTemplateToken(client1);

        const response = await client2.relationshipTemplates.loadPeerRelationshipTemplate({ reference: token.truncatedReference });
        expectSuccess(response, ValidationSchema.RelationshipTemplate);
        templateId = response.result.id;
    });

    test("create relationship", async () => {
        expect(templateId).toBeDefined();

        const response = await client2.relationships.createRelationship({ templateId, content: { a: "b" } });
        expectSuccess(response, ValidationSchema.Relationship);
    });

    test("sync relationships", async () => {
        expect(templateId).toBeDefined();

        const relationships = await syncUntilHasRelationships(client1);
        expect(relationships).toHaveLength(1);

        relationshipId = relationships[0].id;
        relationshipChangeId = relationships[0].changes[0].id;
    });

    test("accept relationship", async () => {
        expect(relationshipId).toBeDefined();
        expect(relationshipChangeId).toBeDefined();

        const response = await client1.relationships.acceptRelationshipChange(relationshipId, relationshipChangeId, { content: { a: "b" } });
        expectSuccess(response, ValidationSchema.Relationship);
    });

    test("it should exist a relationship on bc1", async () => {
        expect(relationshipId).toBeDefined();

        const response = await client1.relationships.getRelationships();
        expectSuccess(response, ValidationSchema.Relationships);
        expect(response.result).toHaveLength(1);
    });

    test("check Open Outgoing Relationships on BC2", async () => {
        expect(relationshipId).toBeDefined();

        const relationships = await syncUntilHasRelationships(client2);
        expect(relationships).toHaveLength(1);
    });

    test("it should exist a relationship on bc2", async () => {
        expect(relationshipId).toBeDefined();

        const response = await client2.relationships.getRelationships();
        expectSuccess(response, ValidationSchema.Relationships);
        expect(response.result).toHaveLength(1);
    });

    test("should GET created Relationship on BC1", async () => {
        expect(relationshipId).toBeDefined();

        const response = await client1.relationships.getRelationship(relationshipId);
        expectSuccess(response, ValidationSchema.Relationship);
        expect(response.result.status).toBe("Active");
    });

    test("should GET created Relationship on BC2", async () => {
        expect(relationshipId).toBeDefined();

        const response = await client2.relationships.getRelationship(relationshipId);
        expectSuccess(response, ValidationSchema.Relationship);
        expect(response.result.status).toBe("Active");
    });
});

describe("Relationships query", () => {
    test("query relationships", async () => {
        const relationship = await getRelationship(client1);
        const conditions = new QueryParamConditions(relationship, client1)
            .addDateSet("lastMessageReceivedAt")
            .addDateSet("lastMessageSentAt")
            .addStringSet("peer")
            .addStringSet("status")
            .addStringSet("template.id");

        await conditions.executeTests((c, q) => c.relationships.getRelationships(q), ValidationSchema.Relationships);
    });
});
