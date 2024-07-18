import { IDatabaseMap } from "@js-soft/docdb-access-abstractions";
import { runCommand } from "@oclif/test";
import { BaseCommand } from "../../../src/BaseCommand";
import { ConnectorRuntimeConfig, createConnectorConfig } from "../../../src/connector";
import { setupEnviroment } from "../../setup";

describe("identity init", () => {
    let accountInfo: IDatabaseMap;
    let config: ConnectorRuntimeConfig;
    beforeAll(() => {
        setupEnviroment();
        config = createConnectorConfig();
    });

    beforeEach(async () => {
        const dbConnection = await BaseCommand.createDBConnection(config);
        const db = await dbConnection.getDatabase(`${config.database.dbNamePrefix}${config.database.dbName}`);

        accountInfo = await db.getMap("AccountInfo");
        await accountInfo.get("");
        const list = await accountInfo.list();
        for (const item of list) {
            await accountInfo.delete(item.name);
        }
        // need to close as the data is only written to disk when the connection is closed
        await dbConnection.close();
    });

    test("identity creation", async () => {
        let result = await runCommand("identity init");
        expect(result.stdout.trim()).toContain("Identity created successfully!");

        result = await runCommand("identity init");
        expect(result.stdout.trim()).toContain("Identity already created!");
    });
    test("identity creation json output", async () => {
        let result = await runCommand("identity init --json");
        expect(result.result).toStrictEqual({ message: "Identity created successfully!" });

        result = await runCommand("identity init --json");
        expect(result.result).toStrictEqual({ message: "Identity already created!" });
    });
});
