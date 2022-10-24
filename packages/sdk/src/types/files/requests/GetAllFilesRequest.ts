export interface GetAllFilesRequest {
    createdAt?: string | string[];
    createdBy?: string | string[];
    createdByDevice?: string | string[];
    description?: string | string[];
    expiresAt?: string | string[];
    filename?: string | string[];
    filesize?: string | string[];
    mimetype?: string | string[];
    title?: string | string[];
    isOwn?: boolean | boolean[];
}
