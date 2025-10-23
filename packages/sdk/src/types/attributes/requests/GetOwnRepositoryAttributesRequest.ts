export interface GetOwnRepositoryAttributesRequest {
    onlyLatestVersions?: boolean;
    createdAt?: string;
    "content.tags"?: string | string[];
    "content.value.@type"?: string | string[];
}
