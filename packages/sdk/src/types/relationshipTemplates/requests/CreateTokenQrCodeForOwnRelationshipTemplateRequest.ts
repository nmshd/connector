import { PasswordLocationIndicator } from "@nmshd/core-types";

export interface CreateTokenQrCodeForOwnRelationshipTemplateRequest {
    expiresAt?: string;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: PasswordLocationIndicator;
    };
}
