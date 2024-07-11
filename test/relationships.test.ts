import { ConnectorClient, ConnectorRelationshipAuditLogEntryReason, ConnectorRelationshipStatus } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { getTimeout } from "./lib/setTimeout";
import {
    establishRelationship,
    executeFullCreateAndShareRelationshipAttributeFlow,
    executeFullCreateAndShareRepositoryAttributeFlow,
    getRelationship,
    getTemplateToken,
    syncUntilHasRelationships
} from "./lib/testUtils";
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

    test("terminate relationship and reactivate it", async () => {
        await establishRelationship(client1, client2);
        const relationship = await getRelationship(client1);

        const terminateRelationshipResponse = await client1.relationships.terminateRelationship(relationship.id);
        expect(terminateRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);

        await syncUntilHasRelationships(client2);

        await expectRelationshipToHaveStatusAndReason(client1, relationship.id, ConnectorRelationshipStatus.Terminated);
        await expectRelationshipToHaveStatusAndReason(client2, relationship.id, ConnectorRelationshipStatus.Terminated);

        const reactivateResponse = await client1.relationships.requestRelationshipReactivation(relationship.id);
        expect(reactivateResponse).toBeSuccessful(ValidationSchema.Relationship);
        await syncUntilHasRelationships(client2);

        await expectRelationshipToHaveStatusAndReason(
            client1,
            relationship.id,
            ConnectorRelationshipStatus.Terminated,
            ConnectorRelationshipAuditLogEntryReason.ReactivationRequested
        );
        await expectRelationshipToHaveStatusAndReason(
            client2,
            relationship.id,
            ConnectorRelationshipStatus.Terminated,
            ConnectorRelationshipAuditLogEntryReason.ReactivationRequested
        );

        const rejectReactivationResponse = await client2.relationships.rejectRelationshipReactivation(relationship.id);
        expect(rejectReactivationResponse).toBeSuccessful(ValidationSchema.Relationship);

        await syncUntilHasRelationships(client1);

        await expectRelationshipToHaveStatusAndReason(
            client1,
            relationship.id,
            ConnectorRelationshipStatus.Terminated,
            ConnectorRelationshipAuditLogEntryReason.RejectionOfReactivation
        );
        await expectRelationshipToHaveStatusAndReason(
            client2,
            relationship.id,
            ConnectorRelationshipStatus.Terminated,
            ConnectorRelationshipAuditLogEntryReason.RejectionOfReactivation
        );

        await client1.relationships.requestRelationshipReactivation(relationship.id);
        await syncUntilHasRelationships(client2);
        const revokeReactivationResponse = await client1.relationships.revokeRelationshipReactivation(relationship.id);
        expect(revokeReactivationResponse).toBeSuccessful(ValidationSchema.Relationship);
        await syncUntilHasRelationships(client2);

        await expectRelationshipToHaveStatusAndReason(
            client1,
            relationship.id,
            ConnectorRelationshipStatus.Terminated,
            ConnectorRelationshipAuditLogEntryReason.RevocationOfReactivation
        );
        await expectRelationshipToHaveStatusAndReason(
            client2,
            relationship.id,
            ConnectorRelationshipStatus.Terminated,
            ConnectorRelationshipAuditLogEntryReason.RevocationOfReactivation
        );

        await client1.relationships.requestRelationshipReactivation(relationship.id);
        await syncUntilHasRelationships(client2);
        const acceptReactivationResponse = await client2.relationships.acceptRelationshipReactivation(relationship.id);
        expect(acceptReactivationResponse).toBeSuccessful(ValidationSchema.Relationship);
        await syncUntilHasRelationships(client1);

        await expectRelationshipToHaveStatusAndReason(
            client1,
            relationship.id,
            ConnectorRelationshipStatus.Active,
            ConnectorRelationshipAuditLogEntryReason.AcceptanceOfReactivation
        );
        await expectRelationshipToHaveStatusAndReason(
            client2,
            relationship.id,
            ConnectorRelationshipStatus.Active,
            ConnectorRelationshipAuditLogEntryReason.AcceptanceOfReactivation
        );
    });

    test("terminate relationship and decompose it", async () => {
        await establishRelationship(client1, client2);
        const relationship = await getRelationship(client1);
        const client2Address = (await client2.account.getIdentityInfo()).result.address;

        await executeFullCreateAndShareRelationshipAttributeFlow(client1, client2, {
            value: {
                "@type": "ProprietaryString",
                title: "text",
                value: "AProprietaryString"
            },
            key: "randomKey",
            confidentiality: "public"
        });

        await executeFullCreateAndShareRepositoryAttributeFlow(client1, client2, {
            "@type": "GivenName",
            value: "AGivenName"
        });

        const attributes = await client1.attributes.getAttributes({ shareInfo: { peer: client2Address } });
        expect(attributes).toBeSuccessful(ValidationSchema.ConnectorAttributes);
        expect(attributes.result).toHaveLength(2);

        const terminateRelationshipResponse = await client1.relationships.terminateRelationship(relationship.id);
        expect(terminateRelationshipResponse).toBeSuccessful(ValidationSchema.Relationship);

        await syncUntilHasRelationships(client2);

        const decompose = await client2.relationships.decomposeRelationship(relationship.id);
        expect(decompose).toBeSuccessfulVoidResult();

        const attributesAfterDecomposition = await client1.attributes.getAttributes({ shareInfo: { peer: client2Address } });
        expect(attributesAfterDecomposition).toBeSuccessful(ValidationSchema.ConnectorAttributes);
        expect(attributesAfterDecomposition.result).toHaveLength(2);
    });
});

async function expectRelationshipToHaveStatusAndReason(
    client: ConnectorClient,
    relationshipId: string,
    status?: ConnectorRelationshipStatus,
    reason?: ConnectorRelationshipAuditLogEntryReason
) {
    const response = await client.relationships.getRelationship(relationshipId);
    expect(response).toBeSuccessful(ValidationSchema.Relationship);
    if (status) expect(response.result.status).toBe(status);
    if (reason) expect(response.result.auditLog.at(-1)!.reason).toBe(reason);
}
