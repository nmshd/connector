import { ConnectorRelationshipTemplate } from "../relationshipTemplates/ConnectorRelationshipTemplate";
import { ConnectorIdentity } from "./ConnectorIdentity";
import { ConnectorRelationshipStatus } from "./ConnectorRelationshipStatus";

export enum ConnectorRelationshipAuditLogEntryReason {
    Creation = "Creation",
    AcceptanceOfCreation = "AcceptanceOfCreation",
    RejectionOfCreation = "RejectionOfCreation",
    RevocationOfCreation = "RevocationOfCreation",
    Termination = "Termination"
}

export interface ConnectorRelationshipAuditLogEntry {
    createdAt: string;
    createdBy: string;
    createdByDevice: string;
    reason: ConnectorRelationshipAuditLogEntryReason;
    oldStatus?: ConnectorRelationshipStatus;
    newStatus: ConnectorRelationshipStatus;
}

export interface ConnectorRelationshipAuditLog extends Array<ConnectorRelationshipAuditLogEntry> {}

export interface ConnectorRelationship {
    id: string;
    template: ConnectorRelationshipTemplate;
    status: ConnectorRelationshipStatus;
    peer: string;
    peerIdentity: ConnectorIdentity;
    creationContent: any;
    auditLog: ConnectorRelationshipAuditLog;
}
