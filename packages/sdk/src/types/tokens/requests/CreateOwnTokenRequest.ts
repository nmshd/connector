export interface CreateOwnTokenRequest {
    expiresAt: string;
    content: unknown;
    ephemeral?: boolean;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
    };
}
