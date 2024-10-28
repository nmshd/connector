import { DateTime } from "luxon";
import { CommandModule } from "yargs";
import { BaseCommand, ConfigFileOptions, configOptionBuilder } from "../../BaseCommand";

export const identityStatusHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    await new IdentityStatus().run(config);
};
export const yargsIdentityStatusCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "status",
    describe: "show the status of the identity",
    handler: identityStatusHandler,
    builder: configOptionBuilder
};

export class IdentityStatus extends BaseCommand {
    protected async runInternal(): Promise<void> {
        await this.createRuntime();
        if (!this.cliRuntime) {
            throw new Error("Failed to inizitialize runtime");
        }

        try {
            const identityInfoResult = await this.cliRuntime.getServices().transportServices.account.getIdentityInfo();
            const identityDeletionProcessesResult = await this.cliRuntime.getServices().transportServices.identityDeletionProcesses.getActiveIdentityDeletionProcess();

            const identityInfo = identityInfoResult.value;
            let message = `Id: ${identityInfo.address}`;

            if (identityDeletionProcessesResult.isSuccess) {
                const identityDeletionProcesses = identityDeletionProcessesResult.value;
                message += `\nIdentity deletion status: ${identityDeletionProcesses.status}`;
                message += `\nEnd of approval period: ${DateTime.fromISO(identityDeletionProcesses.approvalPeriodEndsAt ?? "").toLocaleString()}`;
                message += `\nEnd of grace period: ${DateTime.fromISO(identityDeletionProcesses.gracePeriodEndsAt ?? "").toLocaleString()}`;
            }
            this.log.log(message);
        } catch (e: any) {
            this.log.error(e);
        }
    }
}
