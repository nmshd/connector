import { CommandModule } from "yargs";
import type { ConnectorRuntime } from "../../ConnectorRuntime";
import { OpenTelemetry } from "../../OpenTelemetry";
import { createConnectorConfig } from "../../createConnectorConfig";
import { ConfigFileOptions, configOptionBuilder } from "../BaseCommand";

const startConnectorHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    const connectorConfig = createConnectorConfig(config);
    if (!connectorConfig.debug) process.env.TLS_REJECT_UNAUTHORIZED = "1";
    const openTelemetry = await OpenTelemetry.initialize(connectorConfig);
    let runtime: ConnectorRuntime | undefined;

    try {
        const connectorRuntimeModule = await import("../../ConnectorRuntime");
        runtime = await connectorRuntimeModule.ConnectorRuntime.create(connectorConfig, openTelemetry);
        await runtime.start();
    } catch (error) {
        if (runtime) {
            await runtime.stop();
        } else {
            await openTelemetry?.shutdown();
        }
        throw error;
    }
};

export const startConnectorCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "start",
    describe: "start the Connector",
    handler: startConnectorHandler,
    builder: configOptionBuilder
};
