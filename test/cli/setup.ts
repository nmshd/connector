export function setupEnvironment(): void {
    process.env.database = JSON.stringify({
        driver: "lokijs",
        folder: "./",
        dbName: "default",
        dbNamePrefix: "local-"
    });
    process.env.NODE_CONFIG_ENV = "test";
    process.env.API_KEY = "test";

    process.env["transportLibrary:baseUrl"] = process.env["NMSHD_TEST_BASEURL"];
    process.env["transportLibrary:platformClientId"] = process.env["NMSHD_TEST_CLIENTID"];
    process.env["transportLibrary:platformClientSecret"] = process.env["NMSHD_TEST_CLIENTSECRET"];
}
