import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { validateSchema, ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client: ConnectorClient;

beforeAll(async () => ([client] = await launcher.launch(1)), 30000);
afterAll(() => launcher.stop());

describe("Monitoring Endpoints", () => {
    test("check Health", async () => {
        const health = await client.monitoring.getHealth();
        validateSchema(ValidationSchema.ConnectorHealth, health);
    });

    test("check Version", async () => {
        const version = await client.monitoring.getVersion();
        validateSchema(ValidationSchema.ConnectorVersionInfo, version);
    });

    test("check Requests", async () => {
        const version = await client.monitoring.getRequests();
        validateSchema(ValidationSchema.ConnectorRequestCount, version);
    });

    test("check Support", async () => {
        const support = await client.monitoring.getSupport();
        validateSchema(ValidationSchema.ConnectorSupportInformation, support);
    });
});
