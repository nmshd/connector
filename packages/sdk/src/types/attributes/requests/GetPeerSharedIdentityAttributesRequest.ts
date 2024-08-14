export interface GetPeerSharedIdentityAttributesRequest {
    peer: string;
    onlyValid?: boolean;
    "query.createdAt"?: string;
    "query.content.@type"?: string | string[];
    "query.content.tags"?: string | string[];
    "query.content.validFrom"?: string | string[];
    "query.content.validTo"?: string | string[];
    "query.content.key"?: string | string[];
    "query.content.isTechnical"?: string | string[];
    "query.content.confidentiality"?: string | string[];
    "query.content.value.@type"?: string | string[];
    "query.shareInfo"?: string | string[];
    "query.shareInfo.requestReference"?: string | string[];
    "query.shareInfo.notificationReference"?: string | string[];
    hideTechnical?: boolean;
    onlyLatestVersions?: boolean;
    deletionInfo?: string | string[];
    "deletionInfo.deletionStatus"?: string | string[];
    "deletionInfo.deletionDate"?: string | string[];
}
