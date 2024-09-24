import { AxiosInstance } from "axios";
import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { ConnectorClientWithMetadata, Launcher } from "./lib/Launcher";
import { getTimeout } from "./lib/setTimeout";
import { establishRelationship } from "./lib/testUtils";

const launcher = new Launcher();
let axiosClient: AxiosInstance;
let connectorClient1: ConnectorClientWithMetadata;
let connectorClient2: ConnectorClientWithMetadata;
let account2Address: string;
const uuidRegex = new RegExp("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");

beforeAll(async () => {
    [connectorClient1, connectorClient2] = await launcher.launch(2);
    axiosClient = connectorClient1["account"]["httpClient"];
    await establishRelationship(connectorClient1, connectorClient2);
    account2Address = (await connectorClient2.account.getIdentityInfo()).result.address;
}, getTimeout(30000));

afterAll(() => launcher.stop());

describe("test the correlation ids", () => {
    // eslint-disable-next-line jest/expect-expect
    test("should send the the correlation id via webhook", async () => {
        connectorClient1._eventBus?.reset();

        await axiosClient.post<any>("/api/v2/Requests/Outgoing", {
            content: {
                items: [{ "@type": "ReadAttributeRequestItem", mustBeAccepted: false, query: { "@type": "IdentityAttributeQuery", valueType: "Surname" } }],
                expiresAt: DateTime.now().plus({ hour: 1 }).toISO()
            },
            peer: account2Address
        });

        await connectorClient1._eventBus?.waitForEvent("consumption.outgoingRequestCreated", (event: any) => {
            return uuidRegex.test(event.headers["x-correlation-id"]);
        });
    });

    // eslint-disable-next-line jest/expect-expect
    test("should log the custom correlation id", async () => {
        connectorClient1._eventBus?.reset();

        const customCorrelationId = randomUUID();

        await axiosClient.post<any>(
            "/api/v2/Requests/Outgoing",
            {
                content: {
                    items: [{ "@type": "ReadAttributeRequestItem", mustBeAccepted: false, query: { "@type": "IdentityAttributeQuery", valueType: "Surname" } }],
                    expiresAt: DateTime.now().plus({ hour: 1 }).toISO()
                },
                peer: account2Address
            },
            { headers: { "x-correlation-id": customCorrelationId } }
        );

        await connectorClient1._eventBus?.waitForEvent("consumption.outgoingRequestCreated", (event: any) => {
            return event.headers["x-correlation-id"] === customCorrelationId;
        });
    });
});
