export interface CreateOutgoingRequestRequest {
    content: CreateOutgoingRequestRequestContent;
    peer: string;
}

export interface CreateOutgoingRequestRequestContent {
    expiresAt?: string;
    items: (CreateOutgoingRequestRequestContentItem | CreateOutgoingRequestRequestItemContentGroup)[];
}

export interface CreateOutgoingRequestRequestItemContentGroup {
    title?: string;
    description?: string;
    mustBeAccepted: boolean;
    responseMetadata?: object;
    items: CreateOutgoingRequestRequestContentItem[];
}

export interface CreateOutgoingRequestRequestContentItem {
    "@type"?: string;
    title?: string;
    description?: string;
    responseMetadata?: object;
    mustBeAccepted: boolean;
}
