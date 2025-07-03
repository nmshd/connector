export interface CreateTokenForOwnRelationshipTemplateRequest {
    expiresAt?: string;
    ephemeral?: boolean;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: string | number;
    };
}
