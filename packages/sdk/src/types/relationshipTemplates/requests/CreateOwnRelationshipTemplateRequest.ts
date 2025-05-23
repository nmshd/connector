import { ArbitraryRelationshipTemplateContentJSON, RelationshipTemplateContentJSON } from "@nmshd/content";

export interface CreateOwnRelationshipTemplateRequest {
    maxNumberOfAllocations?: number;
    expiresAt: string;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: string | number;
    };
    content: RelationshipTemplateContentJSON | ArbitraryRelationshipTemplateContentJSON;
}
