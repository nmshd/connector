export interface GetOwnTemplatesRequest {
    createdAt?: string | string[];
    expiresAt?: string | string[];
    createdByDevice?: string | string[];
    maxNumberOfAllocations?: number | number[];
    forIdentity?: string | string[];
    passwordProtection?: "" | "!";
    "passwordProtection.password"?: string | string[];
    "passwordProtection.passwordIsPin"?: "true" | "!";
    "passwordProtection.passwordLocationIndicator"?: string | string[];
}
