export interface GetPeerRelationshipTemplatesRequest {
    createdAt?: string | string[];
    expiresAt?: string | string[];
    createdBy?: string | string[];
    maxNumberOfAllocations?: number | number[];
    forIdentity?: string;
    password?: string | string[];
    passwordIsPin?: "true" | "!";
}
