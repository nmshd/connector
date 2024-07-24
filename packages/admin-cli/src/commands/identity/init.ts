import { AccountController, Transport } from "@nmshd/transport";
import { BaseTransportCommand } from "../../BaseTransportCommand";
import { ConnectorRuntimeConfig } from "../../connector";

export default class IdentityInit extends BaseTransportCommand {
    public static readonly description = "Initialize an identity for a new connector";

    public static readonly examples = ["<%= config.bin %> <%= command.id %>"];

    protected async runInternalWithTransport(transport: Transport, connectorConfig: ConnectorRuntimeConfig): Promise<{ message: string }> {
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

    protected enhanceConfig(connectorConfig: ConnectorRuntimeConfig): ConnectorRuntimeConfig {
        connectorConfig.transportLibrary.allowIdentityCreation = true;
        return connectorConfig;
    }
}
