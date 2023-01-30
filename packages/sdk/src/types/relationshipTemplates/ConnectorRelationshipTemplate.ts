import { ConnectorRequest } from "../requests/ConnectorRequest";

export interface ConnectorRelationshipTemplate {
    id: string;
    isOwn: boolean;
    maxNumberOfAllocations?: number;
    createdBy: string;
    createdByDevice: string;
    createdAt: string;
    content: ConnectorRelationshipTemplateContent | unknown;
    expiresAt?: string;
    truncatedReference: string;
}

export interface ConnectorRelationshipTemplateContent {
    "@type": "RelationshipTemplateContent";
    title?: string;
    metadata?: object;
    onNewRelationship: ConnectorRequest;
    onExistingRelationship?: ConnectorRequest;
}
