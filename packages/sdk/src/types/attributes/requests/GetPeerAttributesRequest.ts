export interface GetPeerAttributesRequest {
    peer: string;
    query?: GetPeerAttributesRequestQuery;
    hideTechnical?: boolean;
    onlyLatestVersions?: boolean;
}

export interface GetPeerAttributesRequestQuery {
    "@type"?: string | string[];
    createdAt?: string;
    "content.@type"?: string | string[];
    "content.tags"?: string | string[];
    "content.key"?: string | string[];
    "content.isTechnical"?: string;
    "content.confidentiality"?: string | string[];
    "content.value.@type"?: string | string[];
    sourceReference?: string | string[];
    deletionInfo?: string | string[];
    initialAttributePeer?: string | string[];
    "deletionInfo.deletionStatus"?: string | string[];
    "deletionInfo.deletionDate"?: string | string[];
}
