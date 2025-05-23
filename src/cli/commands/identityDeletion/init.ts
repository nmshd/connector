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

        const result = await this.cliRuntime.getServices().transportServices.identityDeletionProcesses.initiateIdentityDeletionProcess();
        if (result.isError) throw result.error;

        this.log.log("Identity deletion initiated");
    }
}
