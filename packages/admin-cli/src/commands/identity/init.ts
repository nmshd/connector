import { AccountController } from "@nmshd/transport";
import { CommandModule } from "yargs";
import { BaseCommand, ConfigFileOptions, configOptionBuilder } from "../../BaseCommand";

export const identityInitHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    await new IdentityInit().run(config);
};
export const yargsIdentityInitCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "init",
    describe: "initialize the idntity",
    handler: identityInitHandler,
    builder: configOptionBuilder
};

export default class IdentityInit extends BaseCommand {
    public async runInternal(): Promise<{ message: string }> {
        if (!this.transport || !this.connectorConfig) {
            throw new Error("Transport or connectorConfig not initialized");
        }
        const db = await this.transport.createDatabase(`${this.connectorConfig.database.dbNamePrefix}${this.connectorConfig.database.dbName}`);
        const identityCollection = await db.getMap("AccountInfo");
        const identity = await identityCollection.get("identity");
        if (identity) {
            this.log.log("Identity already created!");
            return { message: "Identity already created!" };
        }
        const accoutController = new AccountController(this.transport, db, this.transport.config);
        await accoutController.init();

        this.log.log("Identity created successfully!");
        return { message: "Identity created successfully!" };
    }
}
