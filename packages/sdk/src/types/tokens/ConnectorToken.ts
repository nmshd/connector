import { PasswordLocationIndicator } from "@nmshd/core-types";

export interface ConnectorToken {
    id: string;
    createdBy: string;
    createdByDevice: string;
    content: unknown;
    createdAt: string;
    expiresAt: string;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: PasswordLocationIndicator;
    };
    truncatedReference: string;
    isEphemeral: boolean;
}
