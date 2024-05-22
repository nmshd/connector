import { ConnectorIdentityDeletionProcess } from ".";
import { ConnectorMessage } from "../messages";
import { ConnectorRelationship } from "../relationships";

export interface ConnectorSyncResult {
    messages: ConnectorMessage[];
    relationships: ConnectorRelationship[];
    identityDeletionProcesses: ConnectorIdentityDeletionProcess[];
}
