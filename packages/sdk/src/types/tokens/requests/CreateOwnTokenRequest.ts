export interface CreateOwnTokenRequest {
    expiresAt: string;
    content: any;
    ephemeral?: boolean;
}
