export interface CreateOwnRelationshipTemplateRequest {
    maxNumberOfAllocations?: number;
    expiresAt: string;
    content: unknown;

    /**
     * @deprecated Use `maxNumberOfAllocations` instead.
     * @see maxNumberOfAllocations
     */
    maxNumberOfRelationships?: number;
}
