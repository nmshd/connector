export interface GetOwnFilesRequest {
    createdAt?: string | string[];
    createdByDevice?: string | string[];
    deletedAt?: string | string[];
    deletedBy?: string | string[];
    deletedByDevice?: string | string[];
    description?: string | string[];
    expiresAt?: string | string[];
    filename?: string | string[];
    filesize?: string | string[];
    mimetype?: string | string[];
    title?: string | string[];
}
