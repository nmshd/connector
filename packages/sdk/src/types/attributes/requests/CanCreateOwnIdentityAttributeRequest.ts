import { AttributeValues } from "@nmshd/content";

export interface CanCreateOwnIdentityAttributeRequest {
    content: {
        value: AttributeValues.Identity.Json;
        tags?: string[];
    };
}
