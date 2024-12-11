export interface GetPeerRelationshipTemplatesRequest {
    createdAt?: string | string[];
    expiresAt?: string | string[];
    createdBy?: string | string[];
    maxNumberOfAllocations?: number | number[];
    forIdentity?: string;
    passwordProtection?: "" | "!";
    "passwordProtection.password"?: string | string[];
    "passwordProtection.passwordIsPin"?: "true" | "!";
}
