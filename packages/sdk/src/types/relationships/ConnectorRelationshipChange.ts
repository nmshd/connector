import { ConnectorRelationshipChangeRequest } from "./ConnectorRelationshipChangeRequest";
import { ConnectorRelationshipChangeResponse } from "./ConnectorRelationshipChangeResponse";
import { ConnectorRelationshipChangeStatus } from "./ConnectorRelationshipChangeStatus";
import { ConnectorRelationshipChangeType } from "./ConnectorRelationshipChangeType";

export interface ConnectorRelationshipChange {
    id: string;
    type: ConnectorRelationshipChangeType;
    status: ConnectorRelationshipChangeStatus;
    request: ConnectorRelationshipChangeRequest;
    response?: ConnectorRelationshipChangeResponse;
}
