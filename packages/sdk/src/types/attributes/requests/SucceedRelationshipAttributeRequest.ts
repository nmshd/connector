import { ConnectorAttributeValue } from "../ConnectorAttribute";

export interface SucceedRelationshipAttributeRequest {
    predecessorId: string;
    successorContent: {
        value: ConnectorAttributeValue;
        validFrom?: string;
        validTo?: string;
    };
}
