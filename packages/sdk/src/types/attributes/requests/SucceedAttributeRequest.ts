import { AttributeValues } from "@nmshd/content";

export interface SucceedAttributeRequest {
    successorContent: {
        value: AttributeValues.Identity.Json | AttributeValues.Relationship.Json;
        tags?: string[];
        validFrom?: string;
        validTo?: string;
    };
}
