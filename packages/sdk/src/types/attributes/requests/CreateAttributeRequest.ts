import { ConnectorAttributeValue } from "../ConnectorAttribute";

export interface CreateAttributeRequest {
    content: {
        value: ConnectorAttributeValue;
        tags?: string[];
        validFrom?: string;
        validTo?: string;
    };
}
