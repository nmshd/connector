export interface ConnectorRequestCount {
    since: string;
    requestCount: number;
    requestCountByStatus: Record<string, number>;
}
