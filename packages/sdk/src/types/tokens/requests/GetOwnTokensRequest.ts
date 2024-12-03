export interface GetOwnTokensRequest {
    createdAt?: string | string[];
    createdByDevice?: string | string[];
    expiresAt?: string | string[];
    forIdentity?: string | string[];
    password?: string | string[];
    passwordIsPin?: "true" | "!";
}
