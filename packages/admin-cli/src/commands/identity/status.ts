import { BaseCommand } from "../../BaseCommand";

export interface IdentityStatusCommandJSON {
    address: string;
    activeIdentityDeletion: {
        status: string;
        approvalPeriodEndsAt: string;
        gracePeriodEndsAt: string;
    };
}

export class IdentityStatus extends BaseCommand {
    public static readonly description = "Get the current status of you identity";

    public static readonly examples = ["<%= config.bin %> <%= command.id %>"];

    protected async runInternal(): Promise<any> {
        await this.createRuntime();
        if (!this.cliRuitime) {
            throw new Error("Faild to iniziialize runtime");
        }

        try {
            const identityInfoResult = await this.cliRuitime.getServices().transportServices.account.getIdentityInfo();
            const identityDeletionProcessesResult = await this.cliRuitime.getServices().transportServices.identityDeletionProcesses.getActiveIdentityDeletionProcess();

            const identityInfo = identityInfoResult.value;
            this.log(`Id: ${identityInfo.address}`);
            let activeIdentityDeletion = {};
            if (identityDeletionProcessesResult.isSuccess) {
                const identityDeletionProcesses = identityDeletionProcessesResult.value;
                this.log(`Identity deletionm status: ${identityDeletionProcesses.status}`);
                this.log(`End of approval period: ${identityDeletionProcesses.approvalPeriodEndsAt}`);
                this.log(`End of grace period: ${identityDeletionProcesses.gracePeriodEndsAt}`);
                activeIdentityDeletion = {
                    status: identityDeletionProcesses.status,
                    approvalPeriodEndsAt: identityDeletionProcesses.approvalPeriodEndsAt,
                    gracePeriodEndsAt: identityDeletionProcesses.gracePeriodEndsAt
                };
            }
            return {
                address: identityInfo.address,
                activeIdentityDeletion
            };
        } catch (e: any) {
            this.error(e);
        }
    }
}
