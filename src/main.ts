import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { startConnectorCommand, yargsIdentityDeletionCancelCommand, yargsIdentityDeletionInitCommand, yargsIdentityStatusCommand } from "./cli/commands";

export async function main(): Promise<void> {
    await yargs(hideBin(process.argv))
        .command("identity [command]", "Identity related commands", (yargs) => yargs.command(yargsIdentityStatusCommand).demandCommand(1, "Please specify a command"))
        .command("identityDeletion [command]", "Identity deletion related commands", (yargs) =>
            yargs.command(yargsIdentityDeletionInitCommand).command(yargsIdentityDeletionCancelCommand).demandCommand(1, "Please specify a command")
        )
        .command(startConnectorCommand)
        .demandCommand(1, 1, "Please specify a command")
        .scriptName("")
        .strict()
        .alias("h", "help")
        .parseAsync();
}
