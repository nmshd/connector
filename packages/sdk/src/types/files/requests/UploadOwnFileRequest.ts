export interface UploadOwnFileRequest {
    title?: string;
    description?: string;
    expiresAt: string;
    file: Uint8Array;
    filename: string;
    filenameOverride?: string;
    tags?: string[];
}
