import { IdentityDeletionProcessDTO } from "@nmshd/runtime";
import { BaseCommand } from "../../BaseCommand";

export default class ApproveIdentityDeletion extends BaseCommand {
    public static readonly description = "Initialize an identity deletion";

    public static readonly examples = ["<%= config.bin %> <%= command.id %>"];

    protected async runInternal(): Promise<IdentityDeletionProcessDTO | void> {
        await this.createRuntime();
        if (!this.cliRuitime) {
            throw new Error("Faild to iniziialize runtime");
        }

        const identityDeletionApprovalResult = await this.cliRuitime.getServices().transportServices.identityDeletionProcesses.approveIdentityDeletionProcess();

        if (identityDeletionApprovalResult.isSuccess) {
            this.log("Identity deletion approved");
            return identityDeletionApprovalResult.value;
        }
        this.log(identityDeletionApprovalResult.error.toString());
    }
}
