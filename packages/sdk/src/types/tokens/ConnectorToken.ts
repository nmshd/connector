export interface ConnectorToken {
    id: string;
    createdBy: string;
    createdByDevice: string;
    content: any;
    createdAt: string;
    expiresAt: string;
    secretKey: string;
    truncatedReference: string;
    isEphemeral: boolean;
}
