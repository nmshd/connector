import { ConnectorAttributeValue } from "../ConnectorAttribute";

export interface CreateAndShareRelationshipAttributeRequest {
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

// TODO: Warum gibt es keine CreateAttributeRequest.ts?
// TODO: Watum importieren wir nicht die Datentype aus runtime?
