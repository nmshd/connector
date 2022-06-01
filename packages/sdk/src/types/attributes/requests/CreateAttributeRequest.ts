import { ConnectorIdentityAttribute, ConnectorRelationshipAttribute } from "../ConnectorAttribute";

export interface CreateAttributeRequest {
    content: ConnectorIdentityAttribute | ConnectorRelationshipAttribute;
}
