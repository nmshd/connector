import { ApplicationError } from "@js-soft/ts-utils";
import yargs from "yargs";
import type { ConnectorRuntime } from "../ConnectorRuntime";
import type { ConnectorRuntimeConfig } from "../ConnectorRuntimeConfig";
import { OpenTelemetry } from "../OpenTelemetry";
import { createConnectorConfig } from "../createConnectorConfig";

export interface ConfigFileOptions {
    config?: string;
}

export const configOptionBuilder = (yargs: yargs.Argv<{}>): yargs.Argv<ConfigFileOptions> => {
    return yargs.option("config", {
        alias: "c",
        describe: `Path to the custom configuration file
Can also be set via the CUSTOM_CONFIG_LOCATION env variable`,
        type: "string",
        demandOption: false
    });
};

export abstract class BaseCommand {
    #connectorConfig?: ConnectorRuntimeConfig;
    #cliRuntime?: ConnectorRuntime;
    #openTelemetry?: OpenTelemetry;

    protected get cliRuntime(): ConnectorRuntime {
        if (!this.#cliRuntime) throw new Error("Connector runtime not initialized");

        return this.#cliRuntime;
    }

    protected log = console;

    public async run(configPath: string | undefined): Promise<void> {
        this.#connectorConfig = createConnectorConfig(configPath);
        this.#connectorConfig.infrastructure.httpServer.enabled = false;
        this.#connectorConfig.modules.coreHttpApi.enabled = false;
        this.#connectorConfig.logging = {
            appenders: {
                console: { type: "console" }
            },
            categories: {
                default: { appenders: ["console"], level: "OFF" }
            }
        };
        this.#openTelemetry = await OpenTelemetry.initialize(this.#connectorConfig);

        try {
            await this.runInternal();

            await this.#cliRuntime?.stop();
        } catch (error: any) {
            if (this.#cliRuntime) {
                await this.#cliRuntime.stop();
            } else {
                await this.#openTelemetry?.shutdown();
            }

            if (error instanceof ApplicationError) {
                this.log.log(`This command failed with the code '${error.code}' and the message '${error.message}'.`);
            } else {
                this.log.log(error.message);
            }

            process.exit(1);
        }
    }

    protected async createRuntime(): Promise<void> {
        if (this.#cliRuntime) return;
        if (!this.#connectorConfig) throw new Error("Connector config not initialized");

        const startRuntime = async () => {
            const connectorRuntimeModule = await import("../ConnectorRuntime");
            const runtime = await connectorRuntimeModule.ConnectorRuntime.create(this.#connectorConfig!, this.#openTelemetry);
            this.#cliRuntime = runtime;
            await runtime.start();
        };

        if (this.#openTelemetry) {
            await this.#openTelemetry.traceStartup(startRuntime);
        } else {
            await startRuntime();
        }
    }

    protected abstract runInternal(): Promise<void>;
}
