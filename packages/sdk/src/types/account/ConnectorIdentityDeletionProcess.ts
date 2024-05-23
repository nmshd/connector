export interface ConnectorIdentityDeletionProcess {
    id: string;
    status: ConnectorIdentityDeletionProcessStatus;
    createdAt?: string;
    createdByDevice?: string;
    approvedAt?: string;
    approvedByDevice?: string;
    gracePeriodEndsAt?: string;
    cancelledAt?: string;
    cancelledByDevice?: string;
    rejectedAt?: string;
    rejectedByDevice?: string;
}

export enum ConnectorIdentityDeletionProcessStatus {
    WaitingForApproval = "WaitingForApproval",
    Rejected = "Rejected",
    Approved = "Approved",
    Deleting = "Deleting",
    Cancelled = "Cancelled"
}
