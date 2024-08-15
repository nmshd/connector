import { ConnectorRelationshipTemplateContentDerivation } from "./ConnectorRelationshipTemplateContentDerivation";

export interface ConnectorRelationshipTemplate {
    id: string;
    isOwn: boolean;
    maxNumberOfAllocations?: number;
    createdBy: string;
    createdByDevice: string;
    createdAt: string;
    content: ConnectorRelationshipTemplateContentDerivation;
    expiresAt?: string;
    secretKey: string;
    truncatedReference: string;
}
