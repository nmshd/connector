import { AccountController } from "@nmshd/transport";
import { BaseCommand } from "../../BaseCommand";

export default class IdentityInit extends BaseCommand {
    public static readonly args = {};

    public static readonly description = "Initialize an identity";

    public static readonly examples = ["<%= config.bin %> <%= command.id %>"];

    public static override readonly flags = { ...BaseCommand.flags };

    public async runInternal(): Promise<void> {
        if (!this.transport || !this.connectorConfig) {
            throw new Error("Transport or connectorConfig not initialized");
        }
        const db = await this.transport.createDatabase(`${this.connectorConfig.database.dbNamePrefix}${this.connectorConfig.database.dbName}`);
        const identityCollection = await db.getMap("AccountInfo");
        const identity = await identityCollection.get("identity");
        if (identity) {
            this.log("Identity already created!");
            return;
        }
        const accoutController = new AccountController(this.transport, db, this.transport.config);
        await accoutController.init();

        this.log("Identity created successfully!");
    }
}
