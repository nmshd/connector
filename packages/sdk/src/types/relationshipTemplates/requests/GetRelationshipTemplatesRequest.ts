export interface GetRelationshipTemplatesRequest {
    createdAt?: string | string[];
    expiresAt?: string | string[];
    createdBy?: string | string[];
    createdByDevice?: string | string[];
    maxNumberOfRelationships?: number | number[];
    isOwn?: boolean | boolean[];
}
