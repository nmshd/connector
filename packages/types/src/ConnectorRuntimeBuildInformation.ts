export interface ConnectorRuntimeBuildInformation {
    version: string;
    build: string;
    date: string;
    commit: string;
    modules: Record<string, ConnectorRuntimeModuleBuildInformation>;
}

export interface ConnectorRuntimeModuleBuildInformation {
    version: string;
    build: string;
    date: string;
    commit: string;
}
