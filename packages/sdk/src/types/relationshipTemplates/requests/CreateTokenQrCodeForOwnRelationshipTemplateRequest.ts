export interface CreateTokenQrCodeForOwnRelationshipTemplateRequest {
    expiresAt?: string;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: string | number;
    };
    /** @deprecated this option is available to provide a grace period for all apps to support the new QR code format and will be removed in the future */
    oldQRCodeFormat?: boolean;
}
