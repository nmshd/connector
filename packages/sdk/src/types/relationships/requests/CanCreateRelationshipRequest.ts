import { ArbitraryRelationshipCreationContentJSON, RelationshipCreationContentJSON } from "@nmshd/content";

export interface CanCreateRelationshipRequest {
    templateId: string;
    creationContent?: ArbitraryRelationshipCreationContentJSON | RelationshipCreationContentJSON;
}
