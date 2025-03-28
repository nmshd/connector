import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { Runtime, RuntimeConfig, RuntimeServices } from "@nmshd/runtime";
import { IConnectorInfrastructureRegistry } from "./infrastructure";

export interface ConnectorRuntimeConfig extends RuntimeConfig {
    database: { dbName: string; dbNamePrefix: string };
}
    public abstract override getServices(): RuntimeServices;
    public abstract getBackboneAuthenticationToken(): Promise<string>;
    public abstract readonly infrastructure: IConnectorInfrastructureRegistry;

    public abstract get databaseConnection(): IDatabaseConnection;
    public override readonly runtimeConfig: TConfig;
}
