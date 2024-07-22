import { NodeLoggerFactory } from "@js-soft/node-logger";
import { Transport } from "@nmshd/transport";
import { BaseCommand } from "../../BaseCommand";
import { CLIRuntime } from "../../CLIRuntime";
import { ConnectorRuntimeConfig } from "../../connector";

export default class IdentityDeletion extends BaseCommand {
    public static readonly args = {};

    public static readonly description = "Initialize an identity deletion";

    public static readonly examples = ["<%= config.bin %> <%= command.id %>"];

    public async runInternal(_: Transport, connectorConfig: ConnectorRuntimeConfig): Promise<void> {
        const loggerFactory = new NodeLoggerFactory(connectorConfig.logging);
        const cliRuitime = new CLIRuntime(connectorConfig, loggerFactory);
        await cliRuitime.init();

        const identityInfo = await cliRuitime.getServices().transportServices.identityDeletionProcesses.initiateIdentityDeletionProcess();
        this.log(JSON.stringify(identityInfo));

        await cliRuitime.stop();
    }
}
