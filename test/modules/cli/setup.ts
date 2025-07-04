import { rm } from "fs/promises";
import { join } from "path";
import getPort from "../../lib/getPort";

export function setupEnvironment(randomAccountName: string): void {
    process.env.database = JSON.stringify({
        driver: "lokijs",
        folder: "./",
        dbName: `default${randomAccountName}`
    });
    process.env.CUSTOM_CONFIG_LOCATION = ".dev/test.json";
    process.env["infrastructure:httpServer:authentication:apiKey:enabled"] = "true";
    process.env["infrastructure:httpServer:authentication:apiKey:keys:default:key"] = "test";
    process.env["infrastructure:httpServer:port"] = getPort().toString();

    process.env["transportLibrary:baseUrl"] = process.env["NMSHD_TEST_BASEURL"];
    process.env["transportLibrary:platformClientId"] = process.env["NMSHD_TEST_CLIENTID"];
    process.env["transportLibrary:platformClientSecret"] = process.env["NMSHD_TEST_CLIENTSECRET"];
}

export async function resetDB(randomAccountName: string): Promise<void> {
    try {
        await rm(join(__dirname, `../../../default${randomAccountName}.db`));
    } catch (_e) {
        // ignore
    }
}
