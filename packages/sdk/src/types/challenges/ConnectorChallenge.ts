export interface ConnectorChallenge {
    id: string;
    expiresAt: string;
    createdBy?: string;
    createdByDevice?: string;
    type: string;
    signature: string;
    challengeString: string;
}
