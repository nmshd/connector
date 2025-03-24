import { CommandModule } from "yargs";
import { BaseCommand, ConfigFileOptions, configOptionBuilder } from "../../BaseCommand";

export const identityDeletionInitHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    const command = new InitIdentityDeletion();
    await command.run(config);
};

export const yargsIdentityDeletionInitCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "init",
    describe: "Initialize the identity deletion",
    handler: identityDeletionInitHandler,
    builder: configOptionBuilder
};

export default class InitIdentityDeletion extends BaseCommand {
    protected async runInternal(): Promise<void> {
        await this.createRuntime();
        if (!this.cliRuntime) {
            throw new Error("Failed to initialize Runtime");
        }

        const identityDeletionInitResult = await this.cliRuntime.getServices().transportServices.identityDeletionProcesses.initiateIdentityDeletionProcess();

        if (identityDeletionInitResult.isSuccess) {
            this.log.log("Identity deletion initiated");
            return;
        }
        this.log.error(identityDeletionInitResult.error.toString());
    }
}
