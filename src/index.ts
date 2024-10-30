#!/usr/bin/env node

import yargs from "yargs";
import { startConnectorCommand } from "./cli/commands";

const argv = yargs(process.argv.slice(2))
    .command(startConnectorCommand)
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
