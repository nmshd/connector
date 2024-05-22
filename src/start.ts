import { ConnectorRuntime } from "./ConnectorRuntime";
import { createConnectorConfig } from "./ConnectorRuntimeConfig";

async function run() {
    const config = createConnectorConfig();
    const runtime = await ConnectorRuntime.create(config);
    await runtime.start();
}
run()
    .then()
    .catch((e) => {
        console.error(e); // eslint-disable-line no-console
        process.exit(1);
    });
