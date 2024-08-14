import { RelationshipTemplateContentDerivation } from "../ConnectorRelationshipContentDerivation";

export interface CreateOwnRelationshipTemplateRequest {
    maxNumberOfAllocations?: number;
    expiresAt: string;
    content: RelationshipTemplateContentDerivation;
}
