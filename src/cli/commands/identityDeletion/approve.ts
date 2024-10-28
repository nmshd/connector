import { CommandModule } from "yargs";
import { BaseCommand, ConfigFileOptions, configOptionBuilder } from "../../BaseCommand";

export const identityDeletionApproveHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    await new ApproveIdentityDeletion().run(config);
};
export const yargsIdentityDeletionApproveCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "approve",
    describe: "approve the identity deletion",
    handler: identityDeletionApproveHandler,
    builder: configOptionBuilder
};

export default class ApproveIdentityDeletion extends BaseCommand {
    public async runInternal(): Promise<void> {
        await this.createRuntime();
        if (!this.cliRuntime) {
            throw new Error("Failed to initialize runtime");
        }

        const identityDeletionApprovalResult = await this.cliRuntime.getServices().transportServices.identityDeletionProcesses.approveIdentityDeletionProcess();

        if (identityDeletionApprovalResult.isSuccess) {
            this.log.log("Identity deletion approved");
            return;
        }
        this.log.log(identityDeletionApprovalResult.error.toString());
    }
}
