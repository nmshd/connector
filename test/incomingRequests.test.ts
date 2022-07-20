import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";

const launcher = new Launcher();
let client1: ConnectorClient; // eslint-disable-line @typescript-eslint/no-unused-vars
let client2: ConnectorClient; // eslint-disable-line @typescript-eslint/no-unused-vars

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), 30000);
afterAll(() => launcher.stop());

describe("Incoming Requests", () => {
    test("a", () => {
        expect(true).toBeTruthy();
    });
});
