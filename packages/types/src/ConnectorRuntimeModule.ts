import { ILogger } from "@js-soft/logging-abstractions";
import { ModuleConfiguration, RuntimeModule } from "@nmshd/runtime";
import { AbstractConnectorRuntime } from "./AbstractConnectorRuntime";
import { ConnectorMode } from "./ConnectorMode";
import { ConnectorRuntimeModuleBuildInformation } from "./ConnectorRuntimeBuildInformation";

export interface ConnectorRuntimeModuleConfiguration extends ModuleConfiguration {
    requiredInfrastructure?: string[];
}

export abstract class ConnectorRuntimeModule<TConfig extends ConnectorRuntimeModuleConfiguration = ConnectorRuntimeModuleConfiguration> extends RuntimeModule<
    TConfig,
    AbstractConnectorRuntime
> {
    public constructor(
        runtime: AbstractConnectorRuntime,
        configuration: TConfig,
        logger: ILogger,
        protected readonly connectorMode: ConnectorMode
    ) {
        super(runtime, configuration, logger);
    }

    public getBuildInformation(): ConnectorRuntimeModuleBuildInformation | undefined {
        // This method can be overridden by subclasses to provide module-specific build information
        return undefined;
    }
}
