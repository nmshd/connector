export interface ConnectorRelationshipTemplate {
    id: string;
    isOwn: boolean;
    maxNumberOfRelationships?: number;
    createdBy: string;
    createdByDevice: string;
    createdAt: string;
    content: any;
    expiresAt?: string;
}
