import { AttributeValues } from "@nmshd/content";

export interface CreateOwnIdentityAttributeRequest {
    content: {
        value: AttributeValues.Identity.Json;
        tags?: string[];
    };
}
