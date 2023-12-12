import { ConnectorAttributeValue } from "../ConnectorAttribute";

export interface SucceedRelationshipAttributeAndNotifyPeerRequest {
    predecessorId: string;
    successorContent: {
        value: ConnectorAttributeValue;
        validFrom?: string;
        validTo?: string;
    };
}
