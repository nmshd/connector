import { CommandModule } from "yargs";
import { ConnectorRuntime } from "../../ConnectorRuntime";
import { createConnectorConfig } from "../../CreateConnectorConfig";
import { ConfigFileOptions, configOptionBuilder } from "../BaseCommand";

export const startConnectorHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    const connectorConfig = createConnectorConfig(undefined, config);
    if (!connectorConfig.debug) process.env.TLS_REJECT_UNAUTHORIZED = "1";
    const runtime = await ConnectorRuntime.create(connectorConfig);
    await runtime.start();
};

export const startConnectorCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "start",
    describe: "start the connector",
    handler: startConnectorHandler,
    builder: configOptionBuilder
};
