import { IdentityDeletionProcessDTO } from "@nmshd/runtime";
import { BaseCommand } from "../../BaseCommand";

export default class CancelIdentityDeletion extends BaseCommand {
    public static readonly description = "Initialize an identity deletion";

    public static readonly examples = ["<%= config.bin %> <%= command.id %>"];

    protected async runInternal(): Promise<IdentityDeletionProcessDTO | void> {
        await this.createRuntime();
        if (!this.cliRuitime) {
            throw new Error("Faild to iniziialize runtime");
        }

        const identityDeletionCancelationResult = await this.cliRuitime.getServices().transportServices.identityDeletionProcesses.cancelIdentityDeletionProcess();

        if (identityDeletionCancelationResult.isSuccess) {
            this.log("Identity deletion canceled");
            return identityDeletionCancelationResult.value;
        }
        this.log(identityDeletionCancelationResult.error.toString());
    }
}
