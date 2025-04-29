import { ArbitraryRelationshipTemplateContentJSON, RelationshipTemplateContentJSON } from "@nmshd/content";
import { PasswordLocationIndicator } from "@nmshd/core-types";

export interface CreateOwnRelationshipTemplateRequest {
    maxNumberOfAllocations?: number;
    expiresAt: string;
    forIdentity?: string;
    passwordProtection?: {
        password: string;
        passwordIsPin?: true;
        passwordLocationIndicator?: PasswordLocationIndicator;
    };
    content: RelationshipTemplateContentJSON | ArbitraryRelationshipTemplateContentJSON;
}
