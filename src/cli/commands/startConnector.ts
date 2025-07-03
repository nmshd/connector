import { CommandModule } from "yargs";
import { ConnectorRuntime } from "../../ConnectorRuntime";
import { createConnectorConfig } from "../../createConnectorConfig";
import { ConfigFileOptions, configOptionBuilder } from "../BaseCommand";

const startConnectorHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    const connectorConfig = createConnectorConfig(config);
    if (!connectorConfig.debug) process.env.TLS_REJECT_UNAUTHORIZED = "1";
    const runtime = await ConnectorRuntime.create(connectorConfig);
    await runtime.start();
};

export const startConnectorCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "start",
    describe: "start the Connector",
    handler: startConnectorHandler,
    builder: configOptionBuilder
};
