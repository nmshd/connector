import axios, { AxiosInstance } from "axios";
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
    axiosClient = axios.create({
        baseURL: connectorClient1._baseUrl,
        validateStatus: (_) => true
    });
    await establishRelationship(connectorClient1, connectorClient2);
    account2Address = (await connectorClient2.account.getIdentityInfo()).result.address;
}, getTimeout(30000));

afterAll(() => launcher.stop());
describe("should log the correlation id", () => {
    test("should log the correlation id", async () => {
        connectorClient1._eventBus?.reset();
        await axiosClient.post<any>(
            "/api/v2/Requests/Outgoing",
            {
                content: {
                    items: [{ "@type": "ReadAttributeRequestItem", mustBeAccepted: false, query: { "@type": "IdentityAttributeQuery", valueType: "Surname" } }],
                    expiresAt: DateTime.now().plus({ hour: 1 }).toISO()
                },
                peer: account2Address
            },
            {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "X-API-KEY": "xxx"
                }
            }
        );
        await connectorClient1._eventBus?.waitForEvent("__headers", (event: any) => {
            return uuidRegex.test(event.data["x-correlation-id"]);
        });

        // Found correlation id otherwise waitForEvent would throw an error
        expect(true).toBe(true);
    });

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
            {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "x-correlation-id": customCorrelationId,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "X-API-KEY": "xxx"
                }
            }
        );
        await connectorClient1._eventBus?.waitForEvent("__headers", (event: any) => {
            return event.data["x-correlation-id"] === customCorrelationId;
        });

        // Found correlation id otherwise waitForEvent would throw an error
        expect(true).toBe(true);
    });
});
