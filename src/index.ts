import { RuntimeConfig } from "@nmshd/runtime";
import nconf from "nconf";
import { ConnectorRuntime } from "./ConnectorRuntime";
import { ConnectorRuntimeConfig } from "./ConnectorRuntimeConfig";

export function createConnectorConfig(overrides?: RuntimeConfig): ConnectorRuntimeConfig {
    function upperCaseToCamelCase(value: string): string {
        const words = value.split("_");
        let newValue = "";
        let i = 0;
        for (let word of words) {
            word = word.toLowerCase();
            const firstLetter = word.substr(0, 1);

            if (i > 0) {
                word = word.replace(firstLetter, firstLetter.toUpperCase());
            }

            newValue += word;

            i++;
        }

        return newValue;
    }

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
                variable.key = upperCaseToCamelCase(variable.key);

                if (variable.value === "true") {
                    variable.value = true;
                } else if (variable.value === "false") {
                    variable.value = false;
                }

                return variable;
            }
        })
        .file("file-from-env", { file: process.env.CUSTOM_CONFIG_LOCATION ?? "config/custom.json" })
        .file("config-env-file", { file: `config/${process.env.NODE_CONFIG_ENV}.json` })
        .file("default-file", { file: "config/default.json" });

    const connectorConfig = nconf.get();
    return connectorConfig;
}

const envKeyMapping: Record<string, string> = {
    // The DATABASE__DB_NAME env variable was called ACCOUNT in the past - we need to keep an alias for backwards compatibility.
    ACCOUNT: "DATABASE__DB_NAME", // eslint-disable-line @typescript-eslint/naming-convention

    DATABASE_NAME: "DATABASE__DB_NAME", // eslint-disable-line @typescript-eslint/naming-convention
    API_KEY: "MODULES__HTTP_SERVER__API_KEY", // eslint-disable-line @typescript-eslint/naming-convention
    DATABASE_CONNECTION_STRING: "DATABASE__CONNECTION_STRING", // eslint-disable-line @typescript-eslint/naming-convention
    SYNC_ENABLED: "MODULES__SYNC__ENABLED", // eslint-disable-line @typescript-eslint/naming-convention
    PLATFORM_CLIENT_ID: "TRANSPORT_LIBRARY__PLATFORM_CLIENT_ID", // eslint-disable-line @typescript-eslint/naming-convention
    PLATFORM_CLIENT_SECRET: "TRANSPORT_LIBRARY__PLATFORM_CLIENT_SECRET" // eslint-disable-line @typescript-eslint/naming-convention
};

function applyAlias(variable: { key: string; value: any }) {
    if (envKeyMapping[variable.key]) {
        variable.key = envKeyMapping[variable.key];
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
