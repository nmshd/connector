export interface CreateTokenQrCodeForOwnRelationshipTemplateRequest {
    expiresAt?: string;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: string | number;
    };
    newQRCodeFormat?: boolean;
}
