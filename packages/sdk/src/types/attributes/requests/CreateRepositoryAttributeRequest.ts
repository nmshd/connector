import { AttributeValues } from "@nmshd/content";

export interface CreateRepositoryAttributeRequest {
    content: {
        value: AttributeValues.Identity.Json;
        tags?: string[];
    };
}
