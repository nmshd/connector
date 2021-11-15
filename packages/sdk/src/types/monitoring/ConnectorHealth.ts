export interface ConnectorHealth {
    isHealthy: boolean;
    services: Record<string, "healthy" | "unhealthy">;
}
