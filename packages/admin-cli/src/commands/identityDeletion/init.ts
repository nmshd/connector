import { IdentityDeletionProcessDTO } from "@nmshd/runtime";
import { BaseCommand } from "../../BaseCommand";

export default class InitIdentityDeletion extends BaseCommand {
    public static readonly description = "Initialize an identity deletion";

    public static readonly examples = ["<%= config.bin %> <%= command.id %>"];

    protected async runInternal(): Promise<IdentityDeletionProcessDTO | void> {
        await this.createRuntime();
        if (!this.cliRuitime) {
            throw new Error("Faild to iniziialize runtime");
        }

        const identityDeletionInitResult = await this.cliRuitime.getServices().transportServices.identityDeletionProcesses.initiateIdentityDeletionProcess();

        if (identityDeletionInitResult.isSuccess) {
            this.log("Identity deletion initiated");
            return identityDeletionInitResult.value;
        }
        this.log(identityDeletionInitResult.error.toString());
    }
}
