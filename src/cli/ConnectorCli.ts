import yargs from "yargs";
import { configOptionBuilder } from "./BaseCommand";
import { yargsIdentityInitCommand } from "./commands/identity/init";
import { startConnectorHandler } from "./commands/start";

export const command = yargs(process.argv.slice(2))
    .command({
        command: "identity [command]",
        describe: "identity related commands ",
        builder: (yargs) => {
            return yargs.command(yargsIdentityInitCommand);
        },
        handler: () => {
            yargs.showHelp();
        }
    })
    .command({
        command: "start",
        describe: "start the connector",
        builder: configOptionBuilder,
        handler: startConnectorHandler
    })
    .demandCommand(1, 1, "Please specify a command")
    .help("h")
    .alias("h", "help")
    .scriptName("connector")
    .strict();
