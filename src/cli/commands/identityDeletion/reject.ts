import { CommandModule } from "yargs";
import { BaseCommand, ConfigFileOptions, configOptionBuilder } from "../../BaseCommand";

export const identityDeletionRejectHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    await new RejectIdentityDeletion().run(config);
};
export const yargsIdentityDeletionRejectCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "reject",
    describe: "reject the identity deletion",
    handler: identityDeletionRejectHandler,
    builder: configOptionBuilder
};

export default class RejectIdentityDeletion extends BaseCommand {
    protected async runInternal(): Promise<void> {
        await this.createRuntime();
        if (!this.cliRuntime) {
            throw new Error("Failed to initialize runtime");
        }

        const identityDeletionRejectionResult = await this.cliRuntime.getServices().transportServices.identityDeletionProcesses.rejectIdentityDeletionProcess();

        if (identityDeletionRejectionResult.isSuccess) {
            this.log.log("Identity deletion rejected");
            return;
        }
        this.log.error(identityDeletionRejectionResult.error.toString());
    }
}
