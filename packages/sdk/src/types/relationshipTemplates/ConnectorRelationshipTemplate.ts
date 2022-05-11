export interface ConnectorRelationshipTemplate {
    id: string;
    isOwn: boolean;
    maxNumberOfRelationships?: number;
    createdBy: string;
    createdByDevice: string;
    createdAt: string;
    content: unknown;
    expiresAt?: string;
}
