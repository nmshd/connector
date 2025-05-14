export interface CreateTokenQrCodeForFileRequest {
    expiresAt?: string;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: string | number;
    };
    /** @deprecated this will be removed in the future */
    oldQRCodeFormat?: boolean;
}
