import { CreateAndShareRelationshipAttributeRequest } from "./CreateAndShareRelationshipAttributeRequest";
import { CreateIdentityAttributeRequest } from "./CreateIdentityAttributeRequest";

export type CreateAttributeRequest = CreateIdentityAttributeRequest | CreateAndShareRelationshipAttributeRequest;
