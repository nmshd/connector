import { ArbitraryRelationshipTemplateContentJSON, RelationshipTemplateContentJSON } from "@nmshd/content";

export interface CreateOwnRelationshipTemplateRequest {
    maxNumberOfAllocations?: number;
    expiresAt: string;
    content: RelationshipTemplateContentJSON | ArbitraryRelationshipTemplateContentJSON;
}
