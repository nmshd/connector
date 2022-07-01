export interface ConnectorRelationshipTemplate {
    id: string;
    isOwn: boolean;
    maxNumberOfAllocations?: number;
    maxNumberOfRelationships?: number;
    createdBy: string;
    createdByDevice: string;
    createdAt: string;
    content: unknown;
    expiresAt?: string;
    truncatedReference: string;
}
