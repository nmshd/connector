import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { getTimeout } from "./lib/setTimeout";
import { establishRelationship, getRelationship, getTemplateToken, syncUntilHasRelationships } from "./lib/testUtils";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

describe("Relationships", () => {
    beforeEach(async () => ([client1, client2] = await launcher.launch(2)), getTimeout(30000));
    afterEach(() => launcher.stop());
    test("should create a relationship", async () => {
        const token = await getTemplateToken(client1);

        const loadRelationshipResponse = await client2.relationshipTemplates.loadPeerRelationshipTemplate({ reference: token.truncatedReference });
        expect(loadRelationshipResponse).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        const templateId = loadRelationshipResponse.result.id;

        const createRelationshipResponse = await client2.relationships.createRelationship({ templateId, creationContent: { a: "b" } });
        expect(createRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);

        const client1Relationships = await syncUntilHasRelationships(client1);
        expect(client1Relationships).toHaveLength(1);

        const relationshipId = client1Relationships[0].id;
        expect(relationshipId).toBeDefined();

        const acceptRelationshipResponse = await client1.relationships.acceptRelationship(relationshipId);
        expect(acceptRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);

        const getRelationshipsResponse = await client1.relationships.getRelationships();
        expect(getRelationshipsResponse).toBeSuccessful(ValidationSchema.Relationships);
        expect(getRelationshipsResponse.result).toHaveLength(1);
        const client2Relationships = await syncUntilHasRelationships(client2);
        expect(client2Relationships).toHaveLength(1);

        const client1GetRelationshipResponse = await client1.relationships.getRelationship(relationshipId);
        expect(client1GetRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);
        expect(client1GetRelationshipResponse.result.status).toBe("Active");

        const client2GetRelationshipResponse = await client2.relationships.getRelationship(relationshipId);
        expect(client2GetRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);
        expect(client2GetRelationshipResponse.result.status).toBe("Active");
    });

    test("query relationships", async () => {
        await establishRelationship(client1, client2);
        const relationship = await getRelationship(client1);
        const conditions = new QueryParamConditions(relationship, client1).addStringSet("peer").addStringSet("status").addStringSet("template.id");

        await conditions.executeTests((c, q) => c.relationships.getRelationships(q), ValidationSchema.Relationships);
    });

    test("reject relationship", async () => {
        const token = await getTemplateToken(client1);

        const loadRelationshipResponse = await client2.relationshipTemplates.loadPeerRelationshipTemplate({ reference: token.truncatedReference });
        expect(loadRelationshipResponse).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        const templateId = loadRelationshipResponse.result.id;

        const createRelationshipResponse = await client2.relationships.createRelationship({ templateId, creationContent: { a: "b" } });
        expect(createRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);

        const client1Relationships = await syncUntilHasRelationships(client1);
        expect(client1Relationships).toHaveLength(1);

        const relationshipId = client1Relationships[0].id;
        expect(relationshipId).toBeDefined();

        const rejectRelationshipResponse = await client1.relationships.rejectRelationship(relationshipId);
        expect(rejectRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);

        await syncUntilHasRelationships(client2);

        const client1GetRelationshipResponse = await client1.relationships.getRelationship(relationshipId);
        expect(client1GetRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);
        expect(client1GetRelationshipResponse.result.status).toBe("Rejected");

        const client2GetRelationshipResponse = await client2.relationships.getRelationship(relationshipId);
        expect(client2GetRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);
        expect(client2GetRelationshipResponse.result.status).toBe("Rejected");
    });

    test("revoke relationship", async () => {
        const token = await getTemplateToken(client1);

        const loadRelationshipResponse = await client2.relationshipTemplates.loadPeerRelationshipTemplate({ reference: token.truncatedReference });
        expect(loadRelationshipResponse).toBeSuccessful(ValidationSchema.RelationshipTemplate);
        const templateId = loadRelationshipResponse.result.id;

        const createRelationshipResponse = await client2.relationships.createRelationship({ templateId, creationContent: { a: "b" } });
        expect(createRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);

        const client1Relationships = await syncUntilHasRelationships(client1);
        expect(client1Relationships).toHaveLength(1);

        const relationshipId = client1Relationships[0].id;
        expect(relationshipId).toBeDefined();

        const revokeRelationshipResponse = await client2.relationships.revokeRelationship(relationshipId);
        expect(revokeRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);

        await syncUntilHasRelationships(client1);

        const client1GetRelationshipResponse = await client1.relationships.getRelationship(relationshipId);
        expect(client1GetRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);
        expect(client1GetRelationshipResponse.result.status).toBe("Revoked");

        const client2GetRelationshipResponse = await client2.relationships.getRelationship(relationshipId);
        expect(client2GetRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);
        expect(client2GetRelationshipResponse.result.status).toBe("Revoked");
    });
});
