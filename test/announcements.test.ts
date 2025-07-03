import { LanguageISO639 } from "@nmshd/core-types";
import { ConnectorClientWithMetadata, Launcher } from "./lib/Launcher";
import { getTimeout } from "./lib/setTimeout";

const launcher = new Launcher();
let client: ConnectorClientWithMetadata;

beforeAll(async () => ([client] = await launcher.launch(1)), getTimeout(30000));

afterAll(() => launcher.stop());

describe("Announcements", () => {
    test("should get all announcements", async () => {
        const response = await client.announcements.getAnnouncements({
            language: LanguageISO639.en
        });

        expect(response).toBeSuccessful();
    });
});
