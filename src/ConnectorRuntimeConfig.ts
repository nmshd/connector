import { ConnectorRuntimeModuleConfiguration } from "@nmshd/connector-types";
import { DeciderModuleConfiguration, RuntimeConfig } from "@nmshd/runtime";
import * as log4js from "log4js";
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

    logging: log4js.Configuration;

    modules: Record<string, ConnectorRuntimeModuleConfiguration> & {
        decider: DeciderModuleConfiguration;
    };

    infrastructure: {
        httpServer: HttpServerConfiguration;
    };

    pinnedTLSCertificateSHA256Fingerprints?: Record<string, string[]>;
    enforceCertificatePinning?: boolean;
}
