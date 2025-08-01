export interface UploadOwnFileRequest {
    title: string;
    description?: string;
    expiresAt: string;
    file: Uint8Array;
    filename: string;
    tags?: string[];
}
