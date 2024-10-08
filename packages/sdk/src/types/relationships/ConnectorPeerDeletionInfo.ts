export enum ConnectorPeerDeletionStatus {
    ToBeDeleted = "ToBeDeleted",
    Deleted = "Deleted"
}

export interface ConnectorPeerDeletionInfo {
    deletionStatus: ConnectorPeerDeletionStatus;
    deletionDate: string;
}
