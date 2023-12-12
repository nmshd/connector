import { SucceedIdentityAttributeRequest } from "./SucceedIdentityAttributeRequest";
import { SucceedRelationshipAttributeAndNotifyPeerRequest } from "./SucceedRelationshipAttributeAndNotifyPeerRequest";

export type SucceedAttributeRequest = SucceedRelationshipAttributeAndNotifyPeerRequest | SucceedIdentityAttributeRequest;
