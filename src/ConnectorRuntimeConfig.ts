import { RuntimeConfig } from "@nmshd/runtime";
import * as log4js from "log4js";

export interface ConnectorRuntimeConfig extends RuntimeConfig {
    database: {
        connectionString: string;
        dbName: string;
    };

    logging: log4js.Configuration;
}
