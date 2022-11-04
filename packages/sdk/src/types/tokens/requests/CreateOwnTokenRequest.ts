export interface CreateOwnTokenRequest {
    expiresAt: string;
    content: unknown;
    ephemeral?: boolean;
}
