import { ArbitraryRelationshipCreationContentJSON, RelationshipCreationContentJSON } from "@nmshd/content";

export interface CreateRelationshipRequest {
    templateId: string;
    creationContent: ArbitraryRelationshipCreationContentJSON | RelationshipCreationContentJSON;
}
