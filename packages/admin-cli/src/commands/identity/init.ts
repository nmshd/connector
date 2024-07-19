import { AccountController } from "@nmshd/transport";
import { BaseCommand } from "../../BaseCommand";

export default class IdentityInit extends BaseCommand {
    public static readonly args = {};

    public static readonly description = "Initialize an identity for a new connector";

    public static readonly examples = ["<%= config.bin %> <%= command.id %>"];

    public async runInternal(): Promise<{ message: string }> {
        if (!this.transport || !this.connectorConfig) {
            throw new Error("Transport or connectorConfig not initialized");
        }
        const db = await this.transport.createDatabase(`${this.connectorConfig.database.dbNamePrefix}${this.connectorConfig.database.dbName}`);
        const identityCollection = await db.getMap("AccountInfo");
        const identity = await identityCollection.get("identity");
        if (identity) {
            this.log("Identity already created!");
            return { message: "Identity already created!" };
        }
        const accoutController = new AccountController(this.transport, db, this.transport.config);
        await accoutController.init();

        this.log("Identity created successfully!");
        return { message: "Identity created successfully!" };
    }
}
