import { CoreError } from "@nmshd/core-types";
import { CommandModule } from "yargs";
import { BaseCommand, ConfigFileOptions, configOptionBuilder } from "../../BaseCommand";

export const identityInitHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    await new IdentityInit().run(config);
};
export const yargsIdentityInitCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "init",
    describe: "initialize the identity",
    handler: identityInitHandler,
    builder: configOptionBuilder
};

export default class IdentityInit extends BaseCommand {
    protected async runInternal(): Promise<void> {
        try {
            await this.createRuntime(false);
            this.log.log("Identity already exists not creating a new one.");
        } catch (error: unknown) {
            if (error instanceof CoreError && error.code === "error.transport.general.noIdentityFound") {
                await this.createRuntime(true);
                const address = (await this.cliRuntime.getServices().transportServices.account.getIdentityInfo()).value.address;
                this.log.log(`Identity with address (${address}) created successfully.`);
            } else {
                throw error;
            }
        }
    }
}
