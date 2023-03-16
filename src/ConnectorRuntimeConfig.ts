import { RuntimeConfig } from "@nmshd/runtime";
import * as log4js from "log4js";
import { ConnectorRuntimeModuleConfiguration } from "./ConnectorRuntimeModule";

export interface ConnectorRuntimeConfig extends RuntimeConfig {
    debug: boolean;

    database: {
        connectionString: string;
        dbName: string;
    };

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
