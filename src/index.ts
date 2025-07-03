#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { startConnectorCommand, yargsIdentityDeletionCancelCommand, yargsIdentityDeletionInitCommand, yargsIdentityInitCommand, yargsIdentityStatusCommand } from "./cli/commands";

yargs(hideBin(process.argv))
    .command({
        command: "identity [command]",
        describe: "Identity related commands",
        builder: (yargs) => {
            return yargs.command(yargsIdentityStatusCommand).command(yargsIdentityInitCommand);
        },
        handler: () => {
            yargs.showHelp("log");
        }
    })
    .command({
        command: "identityDeletion [command]",
        describe: "Identity deletion related commands",
        builder: (yargs) => {
            return yargs.command(yargsIdentityDeletionInitCommand).command(yargsIdentityDeletionCancelCommand);
        },
        handler: () => {
            yargs.showHelp("log");
        }
    })
    .command(startConnectorCommand)
    .demandCommand(1, 1, "Please specify a command")
    .scriptName("")
    .strict()
    .alias("h", "help")
    .parseAsync()
    .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exit(1);
    });
