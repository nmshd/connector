export interface ConnectorToken {
    id: string;
    isOwn: boolean;
    createdBy: string;
    createdByDevice: string;
    content: unknown;
    createdAt: string;
    expiresAt: string;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: string | number;
    };
    truncatedReference: string;
    reference: {
        truncated: string;
        url: string;
    };
    isEphemeral: boolean;
}
