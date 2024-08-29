import { ArbitraryRelationshipCreationContentJSON, RelationshipCreationContentJSON } from "@nmshd/content";
import { ConnectorRelationshipTemplate } from "../relationshipTemplates/ConnectorRelationshipTemplate";
import { ConnectorIdentity } from "./ConnectorIdentity";
import { ConnectorPeerDeletionInfo } from "./ConnectorPeerDeletionInfo";
import { ConnectorRelationshipAuditLogEntry } from "./ConnectorRelationshipAuditLogEntry";
import { ConnectorRelationshipStatus } from "./ConnectorRelationshipStatus";

export interface ConnectorRelationshipAuditLog extends Array<ConnectorRelationshipAuditLogEntry> {}

export interface ConnectorRelationship {
    id: string;
    template: ConnectorRelationshipTemplate;
    status: ConnectorRelationshipStatus;
    peer: string;
    peerDeletionInfo?: ConnectorPeerDeletionInfo;
    peerIdentity: ConnectorIdentity;
    creationContent: RelationshipCreationContentJSON | ArbitraryRelationshipCreationContentJSON;
    auditLog: ConnectorRelationshipAuditLog;
}
