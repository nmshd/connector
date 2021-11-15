import { ConnectorRelationshipTemplate } from "../relationshipTemplates/ConnectorRelationshipTemplate";
import { ConnectorRelationshipChanges } from "./ConnectorRelationshipChanges";
import { ConnectorRelationshipStatus } from "./ConnectorRelationshipStatus";

export interface ConnectorRelationship {
    id: string;
    template: ConnectorRelationshipTemplate;
    status: ConnectorRelationshipStatus;
    peer: string;
    changes: ConnectorRelationshipChanges;
    lastMessageSentAt?: string;
    lastMessageReceivedAt?: string;
}
