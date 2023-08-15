import { ILogger } from "@js-soft/logging-abstractions";
import { ModuleConfiguration, RuntimeModule } from "@nmshd/runtime";
import { ConnectorMode } from "./ConnectorMode";
import { ConnectorRuntime } from "./ConnectorRuntime";

export interface ConnectorRuntimeModuleConfiguration extends ModuleConfiguration {
    requiredInfrastructure?: string[];
}

export abstract class ConnectorRuntimeModule<TConfig extends ConnectorRuntimeModuleConfiguration = ConnectorRuntimeModuleConfiguration> extends RuntimeModule<
    TConfig,
    ConnectorRuntime
> {
    public constructor(
        runtime: ConnectorRuntime,
        configuration: TConfig,
        logger: ILogger,
        protected readonly connectorMode: ConnectorMode
    ) {
        super(runtime, configuration, logger);
    }
}
