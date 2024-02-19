import { RuntimeConfig } from "@nmshd/runtime";
import _ from "lodash";
import nconf from "nconf";
import { ConnectorRuntime } from "./ConnectorRuntime";
import { ConnectorRuntimeConfig } from "./ConnectorRuntimeConfig";

export function createConnectorConfig(overrides?: RuntimeConfig): ConnectorRuntimeConfig {
    nconf
        .overrides(overrides)
        .env({
            transform: (variable: { key: string; value: any }) => {
                applyAlias(variable);

                if (variable.key === "_") {
                    // `ts-node` seems to create an env variable "_", which is not a valid key for nconf
                    // => replace the key with something that no one else will use
                    variable.key = "XXXXXXXXXXX_XXXXXXXXXXXXX";
                    return variable;
                }

                variable.key = variable.key.replace(/__/g, ":");
                variable.value = parseString(variable.value);

                return variable;
            }
        })
        .file("file-from-env", { file: process.env.CUSTOM_CONFIG_LOCATION ?? "config/custom.json" })
        .file("config-env-file", { file: `config/${process.env.NODE_CONFIG_ENV}.json` })
        .file("default-file", { file: "config/default.json" });

    const connectorConfig = nconf.get();

    if (typeof connectorConfig.modules.webhooksV2 !== "undefined") {
        // eslint-disable-next-line no-console
        console.warn("The 'webhooksV2' configuration is deprecated. Please use 'webhooks' instead.");

        connectorConfig.modules.webhooks = _.defaultsDeep(connectorConfig.modules.webhooksV2, connectorConfig.modules.webhooks);
        delete connectorConfig.modules.webhooksV2;
    }

    return connectorConfig;
}

const envKeyMapping: Record<string, string> = {
    // The DATABASE__DB_NAME env variable was called ACCOUNT in the past - we need to keep an alias for backwards compatibility.
    ACCOUNT: "database:dbName", // eslint-disable-line @typescript-eslint/naming-convention

    DATABASE_NAME: "database:dbName", // eslint-disable-line @typescript-eslint/naming-convention
    API_KEY: "infrastructure:httpServer:apiKey", // eslint-disable-line @typescript-eslint/naming-convention
    DATABASE_CONNECTION_STRING: "database:connectionString", // eslint-disable-line @typescript-eslint/naming-convention
    SYNC_ENABLED: "modules:sync:enabled", // eslint-disable-line @typescript-eslint/naming-convention
    PLATFORM_CLIENT_ID: "transportLibrary:platformClientId", // eslint-disable-line @typescript-eslint/naming-convention
    PLATFORM_CLIENT_SECRET: "transportLibrary:platformClientSecret", // eslint-disable-line @typescript-eslint/naming-convention
    DEBUG: "debug" // eslint-disable-line @typescript-eslint/naming-convention
};

function applyAlias(variable: { key: string; value: any }) {
    if (envKeyMapping[variable.key]) {
        variable.key = envKeyMapping[variable.key];
    }
}

function parseString(value: string) {
    try {
        return JSON.parse(value);
    } catch (_) {
        return value;
    }
}

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
