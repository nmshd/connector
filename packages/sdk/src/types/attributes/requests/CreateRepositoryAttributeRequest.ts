import { ConnectorAttributeValue } from "../ConnectorAttribute";

export interface CreateRepositoryAttributeRequest {
    content: {
        value: ConnectorAttributeValue;
        tags?: string[];
        validFrom?: string;
        validTo?: string;
    };
}
