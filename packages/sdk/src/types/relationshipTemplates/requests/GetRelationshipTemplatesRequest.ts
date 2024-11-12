export interface GetRelationshipTemplatesRequest {
    createdAt?: string | string[];
    expiresAt?: string | string[];
    createdBy?: string | string[];
    createdByDevice?: string | string[];
    maxNumberOfAllocations?: number | number[];
    forIdentity?: string | string[];
    isOwn?: boolean | boolean[];
}
