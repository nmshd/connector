import { ConnectorRelationshipTemplate } from "../relationshipTemplates/ConnectorRelationshipTemplate";
import { ConnectorIdentity } from "./ConnectorIdentity";
import { ConnectorRelationshipAuditLogEntry } from "./ConnectorRelationshipAuditLogEntry";
import { ConnectorRelationshipCreationContentDerivation } from "./ConnectorRelationshipCreationContentDerivation";
import { ConnectorRelationshipStatus } from "./ConnectorRelationshipStatus";

export interface ConnectorRelationshipAuditLog extends Array<ConnectorRelationshipAuditLogEntry> {}

export interface ConnectorRelationship {
    id: string;
    template: ConnectorRelationshipTemplate;
    status: ConnectorRelationshipStatus;
    peer: string;
    peerIdentity: ConnectorIdentity;
    creationContent: ConnectorRelationshipCreationContentDerivation;
    auditLog: ConnectorRelationshipAuditLog;
}
