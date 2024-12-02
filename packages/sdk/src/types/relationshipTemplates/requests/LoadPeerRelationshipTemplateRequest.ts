export interface LoadPeerRelationshipTemplateRequest {
    /**
     * starting with 'VE9L' for a truncated reference to a token containing a RelationshipTemplateReference or
     * starting with 'UkxU' for a direct truncated RelationshipTemplateReference
     */
    reference: string;
    password?: string;
}
