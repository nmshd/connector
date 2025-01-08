import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { ConnectorClientWithMetadata, Launcher } from "./lib/Launcher";
import { getTimeout } from "./lib/setTimeout";
import { establishRelationship } from "./lib/testUtils";

const launcher = new Launcher();
let connectorClient1: ConnectorClientWithMetadata;
let connectorClient2: ConnectorClientWithMetadata;
let account2Address: string;
const uuidRegex = new RegExp("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");

beforeAll(async () => {
    [connectorClient1, connectorClient2] = await launcher.launch(2);
    await establishRelationship(connectorClient1, connectorClient2);
    account2Address = (await connectorClient2.account.getIdentityInfo()).result.address;
}, getTimeout(30000));

afterAll(() => launcher.stop());

describe("test the correlation ids", () => {
    test("should send a random correlation id via webhook", async () => {
        connectorClient1._eventBus?.reset();

        await connectorClient1.outgoingRequests.createRequest({
            content: {
                items: [{ "@type": "ReadAttributeRequestItem", mustBeAccepted: false, query: { "@type": "IdentityAttributeQuery", valueType: "Surname" } }],
                expiresAt: DateTime.now().plus({ hour: 1 }).toISO()
            },
            peer: account2Address
        });

        const event = await connectorClient1._eventBus?.waitForEvent("consumption.outgoingRequestCreated", (event: any) => {
            return uuidRegex.test(event.headers["x-correlation-id"]);
        });
        expect(event).toBeDefined();
    });

    test("should send a custom correlation id via webhook", async () => {
        connectorClient1._eventBus?.reset();

        const customCorrelationId = randomUUID();

        await connectorClient1.withCorrelationId(customCorrelationId).outgoingRequests.createRequest({
            content: {
                items: [{ "@type": "ReadAttributeRequestItem", mustBeAccepted: false, query: { "@type": "IdentityAttributeQuery", valueType: "Surname" } }],
                expiresAt: DateTime.now().plus({ hour: 1 }).toISO()
            },
            peer: account2Address
        });

        const event = await connectorClient1._eventBus?.waitForEvent(
            "consumption.outgoingRequestCreated",
            (event: any) => event.headers["x-correlation-id"] === customCorrelationId
        );
        expect(event).toBeDefined();
    });
});
