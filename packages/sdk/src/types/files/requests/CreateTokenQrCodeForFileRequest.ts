import { PasswordLocationIndicator } from "@nmshd/core-types";

export interface CreateTokenQrCodeForFileRequest {
    expiresAt?: string;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: PasswordLocationIndicator;
    };
}
