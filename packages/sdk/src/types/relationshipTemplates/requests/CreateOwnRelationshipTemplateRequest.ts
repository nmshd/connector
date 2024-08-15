import { ConnectorRelationshipTemplateContentDerivation } from "../ConnectorRelationshipTemplateContentDerivation";

export interface CreateOwnRelationshipTemplateRequest {
    maxNumberOfAllocations?: number;
    expiresAt: string;
    content: ConnectorRelationshipTemplateContentDerivation;
}
