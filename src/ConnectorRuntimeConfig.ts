import { RuntimeConfig } from "@nmshd/runtime";
import * as log4js from "log4js";
import { ConnectorRuntimeModuleConfiguration } from "./ConnectorRuntimeModule";

export interface MongoDBSettings {
    driver: "mongodb";
    connectionString: string;
}

export interface LokiJSSettings {
    driver: "lokijs";
    folder: string;
}

export interface ConnectorRuntimeConfig extends RuntimeConfig {
    debug: boolean;

    database: (MongoDBSettings | LokiJSSettings) & { dbName: string; dbNamePrefix: string };

    logging: log4js.Configuration;

    modules: Record<string, ConnectorRuntimeModuleConfiguration>;

    infrastructure: {
        httpServer: {
            enabled: boolean;
            apiKey: string;
            cors?: any;
        };
    };
}
