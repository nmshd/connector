#!/usr/bin/env node
import yargs from "yargs";
import { yargsIdentityInitCommand } from "./commands/identity/init";
import { yargsIdentityStatusCommand } from "./commands/identity/status";
import { yargsIdentityDeletionApproveCommand } from "./commands/identityDeletion/approve";
import { yargsIdentityDeletionCancelCommand } from "./commands/identityDeletion/cancel";
import { yargsIdentityDeletionInitCommand } from "./commands/identityDeletion/init";
import { yargsIdentityDeletionRejectCommand } from "./commands/identityDeletion/reject";

const completionFunction: yargs.FallbackCompletionFunction = (current, argv, defaultCompletion, done) => {
    defaultCompletion((err, completions) => {
        completions = completions?.filter((completion) => !completion.includes("completion:")) ?? [];
        done(completions);
    });
};

const argv = yargs(process.argv.slice(2))
    .command({
        command: "identity [command]",
        describe: "Identity related commands",
        builder: (yargs) => {
            return yargs.command(yargsIdentityInitCommand).command(yargsIdentityStatusCommand);
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
    .demandCommand(1, 1, "Please specify a command")
    .help("h")
    .alias("h", "help")
    .completion("completion", completionFunction)
    .strict()
    .parse();

Promise.resolve(argv).catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
});
