export interface ConnectorAnnouncement {
    id: string;
    createdAt: string;
    expiresAt?: string;
    severity: ConnectorAnnouncementSeverity;
    title: string;
    body: string;
}

export enum ConnectorAnnouncementSeverity {
    Low = "Low",
    Medium = "Medium",
    High = "High"
}
