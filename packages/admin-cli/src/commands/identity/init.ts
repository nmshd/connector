import { AccountController, Transport } from "@nmshd/transport";
import { BaseCommand } from "../../BaseCommand";
import { ConnectorRuntimeConfig } from "../../connector";

export default class IdentityInit extends BaseCommand {
    public static readonly args = {};

    public static readonly description = "Initialize an identity for a new connector";

    public static readonly examples = ["<%= config.bin %> <%= command.id %>"];

    public async runInternal(transport: Transport, connectorConfig: ConnectorRuntimeConfig): Promise<{ message: string }> {
        const db = await transport.createDatabase(`${connectorConfig.database.dbNamePrefix}${connectorConfig.database.dbName}`);
        const identityCollection = await db.getMap("AccountInfo");
        const identity = await identityCollection.get("identity");
        if (identity) {
            this.log("Identity already created!");
            return { message: "Identity already created!" };
        }
        const accoutController = new AccountController(transport, db, transport.config);
        await accoutController.init();

        this.log("Identity created successfully!");
        return { message: "Identity created successfully!" };
    }
}
