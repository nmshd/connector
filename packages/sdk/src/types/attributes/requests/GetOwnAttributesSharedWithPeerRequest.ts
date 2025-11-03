export interface GetOwnAttributesSharedWithPeerRequest {
    peer: string;
    query?: GetOwnAttributesSharedWithPeerRequestQuery;
    hideTechnical?: boolean;
    onlyLatestVersions?: boolean;
}

export interface GetOwnAttributesSharedWithPeerRequestQuery {
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
    "deletionInfo.deletionStatus"?: string | string[];
    "deletionInfo.deletionDate"?: string | string[];
}
