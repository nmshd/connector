#!/usr/bin/env node

import yargs from "yargs";
import {
    yargsIdentityDeletionApproveCommand,
    yargsIdentityDeletionCancelCommand,
    yargsIdentityDeletionInitCommand,
    yargsIdentityDeletionRejectCommand,
    yargsIdentityStatusCommand,
    yargsStartConnectorCommand
} from "./cli/commands";

const argv = yargs(process.argv.slice(2))
    .command({
        command: "identity [command]",
        describe: "Identity related commands",
        builder: (yargs) => {
            return yargs.command(yargsIdentityStatusCommand);
        },
        handler: () => {
            yargs.showHelp("log");
        }
    })
    .command({
        command: "identityDeletion [command]",
        describe: "Identity deletion related commands",
        builder: (yargs) => {
            return yargs
                .command(yargsIdentityDeletionInitCommand)
                .command(yargsIdentityDeletionApproveCommand)
                .command(yargsIdentityDeletionCancelCommand)
                .command(yargsIdentityDeletionRejectCommand);
        },
        handler: () => {
            yargs.showHelp("log");
        }
    })
    .command(yargsStartConnectorCommand)
    .demandCommand(1, 1, "Please specify a command")
    .help("h")
    .alias("h", "help")
    .scriptName("connector")
    .strict()
    .parse();

Promise.resolve(argv).catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
});
