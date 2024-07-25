#!/usr/bin/env node
import yargs from "yargs";
import { createLogger } from "./BaseCommand";
import { yargsIdentityInitCommand } from "./commands/identity/init";

const log = createLogger("admin-cli");
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
    log.error(e);
    process.exit(1);
});
