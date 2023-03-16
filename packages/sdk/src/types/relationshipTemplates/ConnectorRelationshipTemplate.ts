import { ConnectorRequestContent } from "../requests/ConnectorRequestContent";

export interface ConnectorRelationshipTemplate {
    id: string;
    isOwn: boolean;
    maxNumberOfAllocations?: number;
    createdBy: string;
    createdByDevice: string;
    createdAt: string;
    content: ConnectorRelationshipTemplateContent | unknown;
    expiresAt?: string;
    secretKey: string;
    truncatedReference: string;
}

export interface ConnectorRelationshipTemplateContent {
    "@type": "RelationshipTemplateContent";
    title?: string;
    metadata?: object;
    onNewRelationship: ConnectorRequestContent;
    onExistingRelationship?: ConnectorRequestContent;
}
