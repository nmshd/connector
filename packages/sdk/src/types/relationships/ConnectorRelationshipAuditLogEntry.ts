import { ConnectorRelationshipAuditLogEntryReason } from "./ConnectorRelationshipAuditLogEntryReason";
import { ConnectorRelationshipStatus } from "./ConnectorRelationshipStatus";

export interface ConnectorRelationshipAuditLogEntry {
    createdAt: string;
    createdBy: string;
    createdByDevice?: string;
    reason: ConnectorRelationshipAuditLogEntryReason;
    oldStatus?: ConnectorRelationshipStatus;
    newStatus: ConnectorRelationshipStatus;
}
