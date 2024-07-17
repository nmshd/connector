import { runCommand } from "@oclif/test";
import { BaseCommand } from "../../../src/BaseCommand";
import { createConnectorConfig } from "../../../src/connector";

describe("identity init", () => {
    test("identity creation", async () => {
        process.env.database = JSON.stringify({
            driver: "lokijs",
            folder: "./",
            dbName: "default",
            dbNamePrefix: "local-"
        });
        process.env.NODE_CONFIG_ENV = "test";
        const config = createConnectorConfig();

        const dbConnection = await BaseCommand.createDBConnection(config);
        const db = await dbConnection.getDatabase(`${config.database.dbNamePrefix}${config.database.dbName}`);

        const accountInfo = await db.getMap("AccountInfo");

        await accountInfo.get("");
        const list = await accountInfo.list();
        for (const item of list) {
            await accountInfo.delete(item.name);
        }

        await dbConnection.close();

        let { stdout } = await runCommand("identity init");

        expect(stdout).toContain("Identity created successfully!");

        stdout = (await runCommand("identity init")).stdout;

        expect(stdout).toContain("Identity already created!");
    });
});
