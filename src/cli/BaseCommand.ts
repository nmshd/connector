import yargs from "yargs";
import { ConnectorRuntime } from "../ConnectorRuntime";
import { ConnectorRuntimeConfig } from "../ConnectorRuntimeConfig";
import { createConnectorConfig } from "../CreateConnectorConfig";

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
    private connectorConfig?: ConnectorRuntimeConfig;
    protected cliRuntime?: ConnectorRuntime;
    protected log = console;

    public async run(configPath: string | undefined): Promise<any> {
        try {
            this.connectorConfig = createConnectorConfig(configPath);
            this.connectorConfig.infrastructure.httpServer.enabled = false;
            this.connectorConfig.modules.coreHttpApi.enabled = false;
            this.connectorConfig.logging = {
                appenders: {
                    console: { type: "console" }
                },
                categories: {
                    default: { appenders: ["console"], level: "OFF" }
                }
            };
            return await this.runInternal(this.connectorConfig);
        } catch (error: any) {
            this.log.log("Error creating identity: ", error);
        } finally {
            if (this.cliRuntime) {
                await this.cliRuntime.stop();
            }
        }
    }

    protected async createRuntime(): Promise<void> {
        if (this.cliRuntime) {
            return;
        }
        if (!this.connectorConfig) throw new Error("Connector config not initialized");
        this.cliRuntime = await ConnectorRuntime.create(this.connectorConfig);
        await this.cliRuntime.start();
    }

    protected abstract runInternal(connectorConfig: ConnectorRuntimeConfig): Promise<void>;
}
