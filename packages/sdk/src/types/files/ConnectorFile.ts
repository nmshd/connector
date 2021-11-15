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
    deletedAt?: string;
    deletedBy?: string;
    deletedByDevice?: string;
    secretKey: string;
}
