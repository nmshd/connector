import { CommandModule } from "yargs";
import { createConnectorConfig } from "../../createConnectorConfig";
import { startConnectorRuntime } from "../../startConnectorRuntime";
import { ConfigFileOptions, configOptionBuilder } from "../BaseCommand";

export function createStartConnectorCommand(shutdownOpenTelemetry: () => Promise<void>): CommandModule<{}, ConfigFileOptions> {
    return {
        command: "start",
        describe: "start the Connector",
        handler: async ({ config }): Promise<void> => {
            const connectorConfig = createConnectorConfig(config);
            if (!connectorConfig.debug) process.env.TLS_REJECT_UNAUTHORIZED = "1";
            await startConnectorRuntime(connectorConfig, shutdownOpenTelemetry);
        },
        builder: configOptionBuilder
    };
}
