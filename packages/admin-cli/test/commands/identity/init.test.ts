import { IDatabaseMap } from "@js-soft/docdb-access-abstractions";
import { BaseCommand } from "../../../src/BaseCommand";
import { identityInitHandler } from "../../../src/commands/identity/init";
import { ConnectorRuntimeConfig, createConnectorConfig } from "../../../src/connector";
import { setupEnviroment } from "../../setup";

describe("identity init", () => {
    let accountInfo: IDatabaseMap;
    let config: ConnectorRuntimeConfig;
    let originalArgv: any;
    beforeAll(() => {
        setupEnviroment();
        config = createConnectorConfig();
    });

    afterEach(() => {
        jest.resetAllMocks();

        // Set process arguments back to the original value
        process.argv = originalArgv;
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

        // Remove all cached modules. The cache needs to be cleared before running
        // each command, otherwise you will see the same results from the command
        // run in your first test in subsequent tests.
        jest.resetModules();

        // Each test overwrites process arguments so store the original arguments
        originalArgv = process.argv;
    });

    test("identity creation", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await identityInitHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledWith("Identity created successfully!");
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        await identityInitHandler({ config: undefined });
        expect(consoleSpy).toHaveBeenCalledWith("Identity already created!");
        expect(consoleSpy).toHaveBeenCalledTimes(2);
    });
});
