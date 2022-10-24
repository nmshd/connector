export interface ConnectorFile {
    id: string;
    filename: string;
    filesize: number;
    createdAt: string;
    createdBy: string;
    createdByDevice: string;
    expiresAt: string;
    mimetype: string;
    isOwn: boolean;
    title: string;
    description?: string;
    secretKey: string;
    truncatedReference: string;
}
