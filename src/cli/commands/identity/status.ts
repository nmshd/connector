import { IdentityDeletionProcessStatus } from "@nmshd/runtime";
import { DateTime } from "luxon";
import { CommandModule } from "yargs";
import { BaseCommand, ConfigFileOptions, configOptionBuilder } from "../../BaseCommand";

export const identityStatusHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    await new IdentityStatus().run(config);
};

export const yargsIdentityStatusCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "status",
    describe: "Show the status of the identity",
    handler: identityStatusHandler,
    builder: configOptionBuilder
};

export class IdentityStatus extends BaseCommand {
    protected async runInternal(): Promise<void> {
        await this.createRuntime();

        const identityInfoResult = await this.cliRuntime.getServices().transportServices.account.getIdentityInfo();
        const identityDeletionProcessResult = await this.cliRuntime.getServices().transportServices.identityDeletionProcesses.getActiveIdentityDeletionProcess();

        const identityInfo = identityInfoResult.value;
        let message = `Identity Address: ${identityInfo.address}`;

        if (identityDeletionProcessResult.isSuccess) {
            const identityDeletionProcess = identityDeletionProcessResult.value;
            message += `\nIdentity deletion status: ${identityDeletionProcess.status}`;
            if (identityDeletionProcess.gracePeriodEndsAt && identityDeletionProcess.status === IdentityDeletionProcessStatus.Approved) {
                message += `\nEnd of grace period: ${DateTime.fromISO(identityDeletionProcess.gracePeriodEndsAt).toLocaleString()}`;
            }
        }

        this.log.log(message);
    }
}
