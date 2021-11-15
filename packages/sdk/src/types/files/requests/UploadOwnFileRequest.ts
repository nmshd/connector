export interface UploadOwnFileRequest {
    title: string;
    description?: string;
    expiresAt: string;
    file: ArrayBuffer;
    filename: string;
}
