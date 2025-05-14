export interface ConnectorFile {
    id: string;
    isOwn: boolean;
    filename: string;
    tags?: string[];
    filesize: number;
    createdAt: string;
    createdBy: string;
    createdByDevice: string;
    expiresAt: string;
    mimetype: string;
    title?: string;
    description?: string;
    reference: {
        truncated: string;
        url: string;
    };
}
