export interface ConnectorToken {
    id: string;
    createdBy: string;
    createdByDevice: string;
    content: unknown;
    createdAt: string;
    expiresAt: string;
    truncatedReference: string;
    isEphemeral: boolean;
}
