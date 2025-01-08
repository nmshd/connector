export interface CreateTokenQrCodeForFileRequest {
    expiresAt?: string;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
    };
}
