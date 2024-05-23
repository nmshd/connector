import { Command, Flags } from "@oclif/core";

export default abstract class BaseCommand extends Command {
    public static flags = {
        config: Flags.string({ description: "config file", char: "c", default: "./config.json" })
    };
}
