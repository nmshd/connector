import { RuntimeConfig } from "@nmshd/runtime";
import correlator from "correlation-id";
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

    const connectorConfig = nconf.get() as ConnectorRuntimeConfig;
    addCorrelationIdSupportToLogger(connectorConfig);

    if (connectorConfig.modules.sync.enabled && connectorConfig.modules.sse.enabled) {
        // eslint-disable-next-line no-console
        console.warn("The SSE and Sync modules cannot be enabled at the same time, the Sync module will be disabled.");
        connectorConfig.modules.sync.enabled = false;
    }

    return connectorConfig;
}

function addCorrelationIdSupportToLogger(connectorConfig: ConnectorRuntimeConfig) {
    Object.entries(connectorConfig.logging.appenders).forEach(([_key, appender]) => {
        if ("layout" in appender && appender.layout.type === "pattern") {
            const tokens = appender.layout.tokens;

            appender.layout.tokens = {
                ...tokens,
                correlationId: () => {
                    return correlator.getId() ?? "";
                }
            };
        }
    });
}

const envKeyMapping: Record<string, string> = {
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
