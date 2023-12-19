import { ConnectorAttributeValue } from "../ConnectorAttribute";

export interface CreateIdentityAttributeRequest {
    content: {
        value: ConnectorAttributeValue;
        tags?: string[];
        validFrom?: string;
        validTo?: string;
    };
}
