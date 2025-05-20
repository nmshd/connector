import { CommandModule } from "yargs";
import { BaseCommand, ConfigFileOptions, configOptionBuilder } from "../../BaseCommand";

export const identityDeletionCancelHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    await new CancelIdentityDeletion().run(config);
};

export const yargsIdentityDeletionCancelCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "cancel",
    describe: "Cancel the identity deletion",
    handler: identityDeletionCancelHandler,
    builder: configOptionBuilder
};

export default class CancelIdentityDeletion extends BaseCommand {
    protected async runInternal(): Promise<void> {
        await this.createRuntime();

        const result = await this.cliRuntime.getServices().transportServices.identityDeletionProcesses.cancelIdentityDeletionProcess();
        if (result.isError) throw result.error;

        this.log.log("Identity deletion cancelled");
    }
}
