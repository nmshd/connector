import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { Runtime, RuntimeConfig, RuntimeServices } from "@nmshd/runtime";
import { ConnectorRuntimeBuildInformation } from "./ConnectorRuntimeBuildInformation";
import { IConnectorInfrastructureRegistry } from "./infrastructure";

export interface ConnectorRuntimeConfig extends RuntimeConfig {
    database: { dbName: string };
}

export abstract class AbstractConnectorRuntime<TConfig extends ConnectorRuntimeConfig = ConnectorRuntimeConfig> extends Runtime<TConfig> {
    public abstract override getServices(): RuntimeServices;
    public abstract getBackboneAuthenticationToken(): Promise<string>;
    public abstract getBuildInformation(): ConnectorRuntimeBuildInformation;
    public abstract readonly infrastructure: IConnectorInfrastructureRegistry;

    declare public databaseConnection: IDatabaseConnection;
    declare public readonly runtimeConfig: TConfig;
}
