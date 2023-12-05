import { ConnectorAttributeValue } from "../ConnectorAttribute";

export interface CreateIdentityAttributeRequest {
    value: ConnectorAttributeValue;
    tags?: string[];
    validFrom?: string;
    validTo?: string;
}
