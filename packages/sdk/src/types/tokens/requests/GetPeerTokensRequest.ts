export interface GetPeerTokensRequest {
    createdAt?: string | string[];
    createdBy?: string | string[];
    expiresAt?: string | string[];
    forIdentity?: string;
    passwordProtection?: "" | "!";
    "passwordProtection.password"?: string | string[];
    "passwordProtection.passwordIsPin"?: "true" | "!";
    "passwordProtection.passwordLocationIndicator"?: string | string[];
}
