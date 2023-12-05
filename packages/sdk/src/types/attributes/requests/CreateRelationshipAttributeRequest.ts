import { ConnectorAttributeValue } from "../ConnectorAttribute";

export interface CreateRelationshipAttributeRequest {
    content: {
        value: ConnectorAttributeValue;
        key: string;
        confidentiality: "public" | "private" | "protected";
        isTechnical?: boolean;
        validFrom?: string;
        validTo?: string;
    };
    peer: string;
    requestMetadata?: {
        title?: string;
        description?: string;
        metadata?: Record<string, any>;
        expiresAt?: string;
    };
}
