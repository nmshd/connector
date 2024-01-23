import { ConnectorAttributeValue } from "../ConnectorAttribute";

export interface SucceedAttributeRequest {
    successorContent: {
        value: ConnectorAttributeValue;
        tags?: string[];
        validFrom?: string;
        validTo?: string;
    };
}
