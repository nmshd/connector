import { CommandModule } from "yargs";
import { createConnectorConfig } from "../../createConnectorConfig";
import { startConnectorRuntime } from "../../startConnectorRuntime";
import { ConfigFileOptions, configOptionBuilder } from "../BaseCommand";

const startConnectorHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    const connectorConfig = createConnectorConfig(config);
    if (!connectorConfig.debug) process.env.TLS_REJECT_UNAUTHORIZED = "1";
    await startConnectorRuntime(connectorConfig);
};

export const startConnectorCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "start",
    describe: "start the Connector",
    handler: startConnectorHandler,
    builder: configOptionBuilder
};
