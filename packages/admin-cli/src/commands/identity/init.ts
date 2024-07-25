import { AccountController, Transport } from "@nmshd/transport";
import { CommandModule } from "yargs";
import { ConfigFileOptions, configOptionBuilder } from "../../BaseCommand";
import { BaseTransportCommand } from "../../BaseTransportCommand";
import { ConnectorRuntimeConfig } from "../../connector";

export const identityInitHandler = async ({ config }: ConfigFileOptions): Promise<void> => {
    await new IdentityInit().run(config);
};
export const yargsIdentityInitCommand: CommandModule<{}, ConfigFileOptions> = {
    command: "init",
    describe: "initialize the idntity",
    handler: identityInitHandler,
    builder: configOptionBuilder
};

export default class IdentityInit extends BaseTransportCommand {
    protected async runInternalWithTransport(transport: Transport, connectorConfig: ConnectorRuntimeConfig): Promise<{ message: string }> {
        const db = await transport.createDatabase(`${connectorConfig.database.dbNamePrefix}${connectorConfig.database.dbName}`);
        const identityCollection = await db.getMap("AccountInfo");
        const identity = await identityCollection.get("identity");
        if (identity) {
            this.log.log("Identity already created!");
            return { message: "Identity already created!" };
        }
        const accoutController = new AccountController(transport, db, transport.config);
        await accoutController.init();

        this.log.log("Identity created successfully!");
        return { message: "Identity created successfully!" };
    }

    protected enhanceConfig(connectorConfig: ConnectorRuntimeConfig): ConnectorRuntimeConfig {
        connectorConfig.transportLibrary.allowIdentityCreation = true;
        return connectorConfig;
    }
}
