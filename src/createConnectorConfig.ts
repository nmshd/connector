import correlator from "correlation-id";
import fs from "fs";
import { validate as validateSchema } from "jsonschema";
import nconf from "nconf";
import path from "path";
import { ConnectorRuntimeConfig } from "./ConnectorRuntimeConfig";

export function createConnectorConfig(customConfigLocation?: string): ConnectorRuntimeConfig {
    nconf
        .argv()
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
        .file("file-from-env", { file: customConfigLocation ?? process.env.CUSTOM_CONFIG_LOCATION ?? "config.json" });

    const bundledConfigsPath = path.join(__dirname, "..", "bundledConfigs");

    if (fs.existsSync(bundledConfigsPath)) {
        let bundledConfigPaths = fs.readdirSync(bundledConfigsPath);

        bundledConfigPaths = bundledConfigPaths.filter((file) => {
            return file.endsWith(".json");
        });

        for (const bundledConfigPath of bundledConfigPaths) {
            nconf.file(bundledConfigPath, { file: path.join(bundledConfigsPath, bundledConfigPath) });
        }
    }

    nconf.defaults({
        debug: false,
        transportLibrary: {
            allowIdentityCreation: true
        },
        database: {
            driver: "mongodb",
            dbName: "default",
            dbNamePrefix: "acc-"
        },
        logging: {
            appenders: {
                consoleAppender: {
                    type: "stdout",
                    layout: { type: "pattern", pattern: "%[[%d] [%p] %c - %m %x{correlationId}%]" }
                },
                console: {
                    type: "logLevelFilter",
                    level: "INFO",
                    appender: "consoleAppender"
                }
            },

            categories: {
                default: {
                    appenders: ["console"],
                    level: "TRACE"
                }
            }
        },
        infrastructure: {
            httpServer: {
                enabled: true,

                cors: {
                    origin: false
                }
            }
        },
        modules: {
            notification: { enabled: true, location: "@nmshd/runtime:NotificationModule" },
            decider: { enabled: true, location: "@nmshd/runtime:DeciderModule" },
            request: { enabled: true, location: "@nmshd/runtime:RequestModule" },
            attributeListener: { enabled: true, location: "@nmshd/runtime:AttributeListenerModule" },
            autoAcceptPendingRelationships: { enabled: false, location: "@nmshd/connector:AutoAcceptPendingRelationshipsModule" },
            autoDecomposeDeletionProposedRelationships: { enabled: false, location: "@nmshd/connector:AutoDecomposeDeletionProposedRelationshipsModule" },
            coreHttpApi: {
                enabled: true,
                location: "@nmshd/connector:CoreHttpApiModule",

                requiredInfrastructure: ["httpServer"],

                docs: {
                    enabled: false,
                    rapidoc: {
                        persistAuth: false
                    }
                }
            },
            webhooks: {
                enabled: false,
                location: "@nmshd/connector:WebhooksModule",
                targets: {},
                webhooks: []
            },
            messageBrokerPublisher: {
                enabled: false,
                location: "@nmshd/connector:MessageBrokerPublisherModule",
                brokers: []
            },
            sync: {
                enabled: false,
                location: "@nmshd/connector:SyncModule",

                interval: 60
            },
            sse: { enabled: false, location: "@nmshd/connector:SseModule" }
        }
    });

    const connectorConfig = nconf.get() as ConnectorRuntimeConfig;

    addCorrelationIdSupportToLogger(connectorConfig);

    if (connectorConfig.modules.sync.enabled && connectorConfig.modules.sse.enabled) {
        // eslint-disable-next-line no-console
        console.warn("The SSE and Sync modules cannot be enabled at the same time, the Sync module will be disabled.");
        connectorConfig.modules.sync.enabled = false;
    }

    validateConnectorConfig(connectorConfig);

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

function validateConnectorConfig(connectorConfig: ConnectorRuntimeConfig): void {
    const schemaPath = path.join(__dirname, "jsonSchemas", "connectorConfig.json");
    const runtimeConfigSchemaString = fs.readFileSync(schemaPath).toString();
    const runtimeConfigSchema = JSON.parse(runtimeConfigSchemaString);
    const result = validateSchema(connectorConfig, runtimeConfigSchema);
    if (!result.valid) {
        let errorMessage = "The configuration is not valid:";
        for (const error of result.errors) {
            errorMessage += `\r\n  - ${error.stack}`;
        }
        throw new Error(errorMessage);
    }

    if (!connectorConfig.transportLibrary.baseUrl.startsWith("http://") && !connectorConfig.transportLibrary.baseUrl.startsWith("https://")) {
        // eslint-disable-next-line no-console
        console.error("The 'transportLibrary.baseUrl' must either start with 'http://' or 'https://'.");
        process.exit(1);
    }
}
