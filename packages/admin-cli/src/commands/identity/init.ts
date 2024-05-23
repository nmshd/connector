import { createConnectorConfig } from "@nmshd/connector";
import BaseCommand from "../../BaseCommand";
import { CliRuntime } from "../../CliRuntime";

export default class IdentityInit extends BaseCommand {
    public static args = {};

    public static description = "Initialize an identity";

    public static examples = [`<%= config.bin %> <%= command.id %>`];

    public static override flags = Object.assign({}, BaseCommand.flags);
    /**
     *
     *
     * @return {*}  {Promise<void>}
     * @memberof IdentityInit
     */
    public async run(): Promise<void> {
        const { flags } = await this.parse(IdentityInit);
        process.env.CUSTOM_CONFIG_LOCATION = flags.config;

        let config = createConnectorConfig();
        config.transportLibrary.allowIdentityCreation = true;
        config.logging = {
            appenders: {
                console: { type: "console" }
            },
            categories: {
                default: { appenders: ["console"], level: "OFF" }
            }
        };

        const runtime = await CliRuntime.create(config);
        await runtime.start();
        await runtime.createIdentity();
        await runtime.stop();
        console.log("Identity created successfully!");
    }
}
