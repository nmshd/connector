import { ConnectorRelationshipTemplate } from "../relationshipTemplates/ConnectorRelationshipTemplate";
import { ConnectorIdentity } from "./ConnectorIdentity";
import { ConnectorRelationshipChanges } from "./ConnectorRelationshipChanges";
import { ConnectorRelationshipStatus } from "./ConnectorRelationshipStatus";

export interface ConnectorRelationship {
    id: string;
    template: ConnectorRelationshipTemplate;
    status: ConnectorRelationshipStatus;
    peer: string;
    peerIdentity: ConnectorIdentity;
    changes: ConnectorRelationshipChanges;
}
