import { ArbitraryRelationshipTemplateContentJSON, RelationshipTemplateContentJSON } from "@nmshd/content";

export interface CreateOwnRelationshipTemplateRequest {
    maxNumberOfAllocations?: number;
    expiresAt: string;
    forIdentity?: string;
    content: RelationshipTemplateContentJSON | ArbitraryRelationshipTemplateContentJSON;
}
