import { ConnectorRuntime } from "../../ConnectorRuntime";
import { createConnectorConfig } from "../../ConnectorRuntimeConfig";
import { ConfigFileOptions } from "../BaseCommand";

export const startConnectorHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    const connectorConfig = createConnectorConfig(undefined, config);
    const runtime = await ConnectorRuntime.create(connectorConfig);
    await runtime.start();
};
// export const yargsStartConnectorCommand: CommandModule<{}, ConfigFileOptions> = {
// command: "start",
// describe: "start the connector",
// handler: startConnectorHandler,
// builder: configOptionBuilder
// };
