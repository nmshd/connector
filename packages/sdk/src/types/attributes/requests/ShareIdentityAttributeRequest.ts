export interface ShareIdentityAttributeRequest {
    attributeId: string;
    peer: string;
    requestMetadata?: {
        title?: string;
        description?: string;
        metadata?: Record<string, any>;
        expiresAt?: string;
    };
}
