export interface ConnectorRuntimeBuildInformation {
    version: string;
    build: string;
    date: string;
    commit: string;
    modules?: Record<string, { version: string; build: string; date: string; commit: string }>;
}
