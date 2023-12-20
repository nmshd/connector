import { ConnectorRelationshipAttribute } from "../ConnectorAttribute";

export interface CreateAndShareRelationshipAttributeRequest {
    content: {
        value: ConnectorRelationshipAttribute;
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
