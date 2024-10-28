import { DeciderModuleConfiguration, RuntimeConfig } from "@nmshd/runtime";
import { IConfigOverwrite } from "@nmshd/transport";
import * as log4js from "log4js";
import { ConnectorRuntimeModuleConfiguration } from "./ConnectorRuntimeModule";
import { HttpServerConfiguration } from "./infrastructure";

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

    transportLibrary: Omit<IConfigOverwrite, "supportedIdentityVersion"> & { pinnedPublicKeys?: Record<string, string[]> };

    logging: log4js.Configuration;

    modules: Record<string, ConnectorRuntimeModuleConfiguration> & {
        decider: DeciderModuleConfiguration;
    };

    infrastructure: {
        httpServer: HttpServerConfiguration;
    };
}
