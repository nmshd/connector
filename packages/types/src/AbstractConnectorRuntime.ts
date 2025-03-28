import { Runtime, RuntimeConfig, RuntimeServices } from "@nmshd/runtime";
import { IConnectorInfrastructureRegistry } from "./infrastructure";

export abstract class AbstractConnectorRuntime<TConfig extends RuntimeConfig = RuntimeConfig> extends Runtime<TConfig> {
    public abstract override getServices(): RuntimeServices;
    public abstract getBackboneAuthenticationToken(): Promise<string>;
    public abstract readonly infrastructure: IConnectorInfrastructureRegistry;
    public override readonly runtimeConfig: TConfig;
}
