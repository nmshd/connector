import { Runtime, RuntimeConfig, RuntimeServices } from "@nmshd/runtime";

export interface IInfrastructureRegistry {}

export abstract class AbstractConnectorRuntime<TConfig extends RuntimeConfig = RuntimeConfig> extends Runtime<TConfig> {
    public abstract override getServices(): RuntimeServices;
    public abstract getBackboneAuthenticationToken(): Promise<string>;
    public abstract readonly infrastructure: IInfrastructureRegistry;
}
