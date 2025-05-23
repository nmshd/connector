import { ApplicationError } from "@js-soft/ts-utils";
import yargs from "yargs";
import { ConnectorRuntime } from "../ConnectorRuntime";
import { ConnectorRuntimeConfig } from "../ConnectorRuntimeConfig";
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

        try {
            await this.runInternal();

            await this.#cliRuntime?.stop();
        } catch (error: any) {
            await this.#cliRuntime?.stop();

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

        this.#cliRuntime = await ConnectorRuntime.create(this.#connectorConfig);
        await this.#cliRuntime.start();
    }

    protected abstract runInternal(): Promise<void>;
}
