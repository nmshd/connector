import { ILogger } from "@js-soft/logging-abstractions";
import { ConnectorMode } from "../ConnectorMode";
import { ConnectorRuntime } from "../ConnectorRuntime";

export interface InfrastructureConfiguration {
    enabled: boolean;
}

export abstract class ConnectorInfrastructure<TConfig extends InfrastructureConfiguration = InfrastructureConfiguration> {
    public constructor(
        protected runtime: ConnectorRuntime,
        protected configuration: TConfig,
        protected logger: ILogger,
        public readonly name: string,
        protected readonly connectorMode: ConnectorMode
    ) {}

    public get isEnabled(): boolean {
        return this.configuration.enabled;
    }

    public abstract init(): Promise<void> | void;
    public abstract start(): Promise<void> | void;
    public abstract stop(): Promise<void> | void;
}
