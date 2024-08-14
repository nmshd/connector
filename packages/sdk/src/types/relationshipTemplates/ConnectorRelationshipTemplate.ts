import { RelationshipTemplateContentDerivation } from "./ConnectorRelationshipContentDerivation";

export interface ConnectorRelationshipTemplate {
    id: string;
    isOwn: boolean;
    maxNumberOfAllocations?: number;
    createdBy: string;
    createdByDevice: string;
    createdAt: string;
    content: RelationshipTemplateContentDerivation;
    expiresAt?: string;
    secretKey: string;
    truncatedReference: string;
}
