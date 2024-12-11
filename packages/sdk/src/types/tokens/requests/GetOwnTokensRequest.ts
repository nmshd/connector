export interface GetOwnTokensRequest {
    createdAt?: string | string[];
    createdByDevice?: string | string[];
    expiresAt?: string | string[];
    forIdentity?: string | string[];
    passwordProtection?: "" | "!";
    "passwordProtection.password"?: string | string[];
    "passwordProtection.passwordIsPin"?: "true" | "!";
}
