import { RuntimeConfig } from "@nmshd/runtime";
import * as log4js from "log4js";

export interface ConnectorRuntimeConfig extends RuntimeConfig {
    database: {
        connectionString: string;
        dbName: string;
    };

    logging: log4js.Configuration;

    infrastructure: {
        httpServer: {
            enabled: boolean;
            apiKey?: string;
            cors?: any;
        };
    };
}
