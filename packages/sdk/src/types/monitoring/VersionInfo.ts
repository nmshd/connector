export interface ConnectorVersionInfo {
    version: string;
    build: string;
    date: string;
    commit: string;
    runtimeVersion: string;
    modules: Record<string, { version: string; build: string; date: string; commit: string }>;
}
