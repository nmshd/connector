import { ConnectorRelationshipAttribute } from "../ConnectorAttribute";

export interface SucceedRelationshipAttributeAndNotifyPeerRequest {
    predecessorId: string;
    successorContent: {
        value: ConnectorRelationshipAttribute;
        validFrom?: string;
        validTo?: string;
    };
}
