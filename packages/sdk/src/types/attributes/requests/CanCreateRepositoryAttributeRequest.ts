import { AttributeValues } from "@nmshd/content";

export interface CanCreateRepositoryAttributeRequest {
    content: {
        value: AttributeValues.Identity.Json;
        tags?: string[];
        validFrom?: string;
        validTo?: string;
    };
}
