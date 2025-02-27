import { ILogger } from "@js-soft/logging-abstractions";
import { AbstractConnectorRuntime } from "../AbstractConnectorRuntime";
import { ConnectorMode } from "../ConnectorMode";

export interface InfrastructureConfiguration {
    enabled: boolean;
}

export interface IConnectorInfrastructure {
    readonly name: string;
    readonly isEnabled: boolean;

    init(): Promise<void> | void;
    start(): Promise<void> | void;
    stop(): Promise<void> | void;
}

export abstract class ConnectorInfrastructure<TConfig extends InfrastructureConfiguration = InfrastructureConfiguration> implements IConnectorInfrastructure {
    public constructor(
        protected runtime: AbstractConnectorRuntime,
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
