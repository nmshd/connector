export interface CreateTokenForFileRequest {
    expiresAt?: string;
    ephemeral?: boolean;
    forIdentity?: string;
}
