export interface GetPeerTokensRequest {
    createdAt?: string | string[];
    createdBy?: string | string[];
    expiresAt?: string | string[];
    forIdentity?: string;
    password?: string | string[];
    passwordIsPin?: "true" | "!";
}
