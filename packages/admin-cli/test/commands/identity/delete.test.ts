import { runCommand } from "@oclif/test";
import { setupEnviroment } from "../../setup";

describe("identity init", () => {
    beforeAll(() => {
        setupEnviroment();
    });

    test("identity creation", async () => {
        let result = await runCommand("identity init");

        result = await runCommand("identity delete");
        expect(JSON.parse(result.stdout).success).toBeTruthy();

        expect(true).toBeTruthy();
    });
});
