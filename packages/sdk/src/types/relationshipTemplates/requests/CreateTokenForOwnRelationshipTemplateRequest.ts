import { PasswordLocationIndicator } from "@nmshd/core-types";

export interface CreateTokenForOwnRelationshipTemplateRequest {
    expiresAt?: string;
    ephemeral?: boolean;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: PasswordLocationIndicator;
    };
}
