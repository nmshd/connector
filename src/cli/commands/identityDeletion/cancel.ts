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
        if (!this.cliRuntime) {
            throw new Error("Failed to initialize Runtime");
        }

        const identityDeletionCancellationResult = await this.cliRuntime.getServices().transportServices.identityDeletionProcesses.cancelIdentityDeletionProcess();

        if (identityDeletionCancellationResult.isSuccess) {
            this.log.log("Identity deletion cancelled");
            return;
        }
        this.log.log(identityDeletionCancellationResult.error.toString());
    }
}
