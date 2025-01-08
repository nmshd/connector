export interface CreateTokenForFileRequest {
    expiresAt?: string;
    ephemeral?: boolean;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
    };
}
