import { IdentityAttributeJSON, RelationshipAttributeJSON } from "@nmshd/content";

export interface ConnectorAttribute {
    id: string;
    parentId?: string;
    createdAt: string;
    content: IdentityAttributeJSON | RelationshipAttributeJSON;
    succeeds?: string;
    succeededBy?: string;
    deletionInfo?: ConnectorAttributeDeletionInfo;
    shareInfo?: ConnectorAttributeShareInfo;
    isDefault?: true;
}

export enum ConnectorAttributeDeletionStatus {
    ToBeDeleted = "ToBeDeleted",
    ToBeDeletedByPeer = "ToBeDeletedByPeer",
    DeletedByPeer = "DeletedByPeer",
    DeletedByOwner = "DeletedByOwner",
    DeletionRequestSent = "DeletionRequestSent",
    DeletionRequestRejected = "DeletionRequestRejected"
}

export interface ConnectorAttributeDeletionInfo {
    deletionStatus: ConnectorAttributeDeletionStatus;
    deletionDate: string;
}

export interface ConnectorAttributeShareInfoForRequest {
    requestReference: string;
    peer: string;
    sourceAttribute?: string;
    thirdPartyAddress?: string;
}

export interface ConnectorAttributeShareInfoForNotification {
    notificationReference: string;
    peer: string;
    sourceAttribute?: string;
    thirdPartyAddress?: string;
}

export type ConnectorAttributeShareInfo = ConnectorAttributeShareInfoForNotification | ConnectorAttributeShareInfoForRequest;
