#!/usr/bin/env node
import yargs from "yargs";
import { yargsIdentityInitCommand } from "./commands/identity/init";

const argv = yargs(process.argv.slice(2))
    .command({
        command: "identity",
        describe: "identity control",
        builder: (yargs) => {
            return yargs.command(yargsIdentityInitCommand);
        },
        handler: () => {
            yargs.showHelp();
        }
    })
    .demandCommand(1, 1, "Please specify a command")
    .help("h")
    .alias("h", "help")
    .strict()
    .parse();

Promise.resolve(argv).catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
});
