import { IQLQuery, ThirdPartyRelationshipAttributeQuery } from "../attributes";
import { ConnectorIdentityAttribute, ConnectorRelationshipAttribute } from "../attributes/ConnectorAttribute";
import { IdentityAttributeQuery } from "../attributes/IdentityAttributeQuery";
import { RelationshipAttributeQuery } from "../attributes/RelationshipAttributeQuery";

export interface ConnectorRequestContent {
    "@type"?: string;
    id?: string;
    expiresAt?: string;
    items: (ConnectorRequestItemDerivation | ConnectorRequestContentItemGroup)[];
    title?: string;
    description?: string;
    metadata?: object;
}

export interface ConnectorRequestContentItemGroup {
    "@type"?: "RequestItemGroup";
    title?: string;
    description?: string;
    mustBeAccepted: boolean;
    metadata?: object;
    items: ConnectorRequestItemDerivation[];
}

export type ConnectorRequestItemDerivation =
    | CreateAttributeRequestItem
    | DeleteAttributeRequestItem
    | ShareAttributeRequestItem
    | ProposeAttributeRequestItem
    | ReadAttributeRequestItem
    | ConsentRequestItem
    | AuthenticationRequestItem
    | FreeTextRequestItem
    | RegisterAttributeListenerRequestItem;

export interface ConnectorRequestContentItem {
    "@type"?: string;
    title?: string;
    description?: string;
    responseMetadata?: object;
    mustBeAccepted: boolean;
}

export interface CreateAttributeRequestItem extends ConnectorRequestContentItem {
    "@type": "CreateAttributeRequestItem";
    attribute: ConnectorIdentityAttribute | ConnectorRelationshipAttribute;
}

export interface ShareAttributeRequestItem extends ConnectorRequestContentItem {
    "@type": "ShareAttributeRequestItem";
    attribute: ConnectorIdentityAttribute | ConnectorRelationshipAttribute;
    sourceAttributeId: string;
}

export interface ProposeAttributeRequestItem extends ConnectorRequestContentItem {
    "@type": "ProposeAttributeRequestItem";
    query: IdentityAttributeQuery | RelationshipAttributeQuery | IQLQuery;
    attribute: ConnectorIdentityAttribute | ConnectorRelationshipAttribute;
}

export interface ReadAttributeRequestItem extends ConnectorRequestContentItem {
    "@type": "ReadAttributeRequestItem";
    query: IdentityAttributeQuery | RelationshipAttributeQuery | ThirdPartyRelationshipAttributeQuery | IQLQuery;
}

export interface ConsentRequestItem extends ConnectorRequestContentItem {
    "@type": "ConsentRequestItem";
    consent: string;
    link?: string;
}

export interface AuthenticationRequestItem extends ConnectorRequestContentItem {
    "@type": "AuthenticationRequestItem";
}

export interface FreeTextRequestItem extends ConnectorRequestContentItem {
    "@type": "FreeTextRequestItem";
    freeText: string;
}

export interface RegisterAttributeListenerRequestItem extends ConnectorRequestContentItem {
    "@type": "RegisterAttributeListenerRequestItem";
    query: IdentityAttributeQuery | ThirdPartyRelationshipAttributeQuery;
}

export interface DeleteAttributeRequestItem extends ConnectorRequestContentItem {
    "@type": "DeleteAttributeRequestItem";
    attributeId: string;
}
