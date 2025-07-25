export interface GetOwnFilesRequest {
    createdAt?: string | string[];
    createdByDevice?: string | string[];
    description?: string | string[];
    expiresAt?: string | string[];
    filename?: string | string[];
    filesize?: string | string[];
    mimetype?: string | string[];
    title?: string | string[];
    tags?: string | string[];
    ownershipToken?: string | string[];
    ownershipIsLocked?: string;
}
