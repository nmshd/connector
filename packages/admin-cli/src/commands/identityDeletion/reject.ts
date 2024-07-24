import { IdentityDeletionProcessDTO } from "@nmshd/runtime";
import { BaseCommand } from "../../BaseCommand";

export default class RejectIdentityDeletion extends BaseCommand {
    public static readonly description = "Initialize an identity deletion";

    public static readonly examples = ["<%= config.bin %> <%= command.id %>"];

    protected async runInternal(): Promise<IdentityDeletionProcessDTO | void> {
        await this.createRuntime();
        if (!this.cliRuitime) {
            throw new Error("Faild to iniziialize runtime");
        }

        const identityDeletionRejectionResult = await this.cliRuitime.getServices().transportServices.identityDeletionProcesses.rejectIdentityDeletionProcess();

        if (identityDeletionRejectionResult.isSuccess) {
            this.log("Identity deletion rejected");
            return identityDeletionRejectionResult.value;
        }
        this.log(identityDeletionRejectionResult.error.toString());
    }
}
