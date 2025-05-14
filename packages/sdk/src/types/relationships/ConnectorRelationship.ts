import { ArbitraryRelationshipCreationContentJSON, RelationshipCreationContentJSON } from "@nmshd/content";
import { ConnectorIdentity } from "./ConnectorIdentity";
import { ConnectorPeerDeletionInfo } from "./ConnectorPeerDeletionInfo";
import { ConnectorRelationshipAuditLogEntry } from "./ConnectorRelationshipAuditLogEntry";
import { ConnectorRelationshipStatus } from "./ConnectorRelationshipStatus";

export interface ConnectorRelationshipAuditLog extends Array<ConnectorRelationshipAuditLogEntry> {}

export interface ConnectorRelationship {
    id: string;
    templateId: string;
    status: ConnectorRelationshipStatus;
    peer: string;
    peerDeletionInfo?: ConnectorPeerDeletionInfo;
    peerIdentity: ConnectorIdentity;
    creationContent: RelationshipCreationContentJSON | ArbitraryRelationshipCreationContentJSON;
    auditLog: ConnectorRelationshipAuditLog;
}
