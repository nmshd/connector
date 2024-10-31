#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { startConnectorCommand } from "./cli/commands";

yargs(hideBin(process.argv))
    .command(startConnectorCommand)
    .demandCommand(1, 1, "Please specify a command")
    .scriptName("nmshd-connector")
    .strict()
    .alias("h", "help")
    .parseAsync()
    .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exit(1);
    });
