export interface GetOwnRepositoryAttributesRequest {
    onlyLatestVersions?: boolean;
    createdAt?: string;
    "content.tags"?: string | string[];
    "content.validFrom"?: string | string[];
    "content.validTo"?: string | string[];
    "content.value.@type"?: string | string[];
    deletionInfo?: string | string[];
    "deletionInfo.deletionStatus"?: string | string[];
    "deletionInfo.deletionDate"?: string | string[];
}
