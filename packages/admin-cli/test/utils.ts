export function setupEnviroment(dbName: string): void {
    process.env.database = JSON.stringify({
        driver: "lokijs",
        folder: "./",
        dbName: dbName,
        dbNamePrefix: "cliTest-"
    });
    process.env.NODE_CONFIG_ENV = "test";
    process.env.API_KEY = "test";

    process.env["transportLibrary:baseUrl"] = process.env["NMSHD_TEST_BASEURL"];
    process.env["transportLibrary:platformClientId"] = process.env["NMSHD_TEST_CLIENTID"];
    process.env["transportLibrary:platformClientSecret"] = process.env["NMSHD_TEST_CLIENTSECRET"];
}

export async function resetDB(dbName: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const shelljs = require("shelljs");
    await shelljs.rm("-rf", `./cliTest-${dbName}.db`);
}
