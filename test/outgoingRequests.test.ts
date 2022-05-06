import { ConnectorClient, ConnectorRequestStatus } from "@nmshd/connector-sdk";
import { DateTime } from "luxon";
import { Launcher } from "./lib/Launcher";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), 30000);
afterAll(() => launcher.stop());

describe("Outgoing Requests", () => {
    test("sender: create an outgoing Request in status Draft", async () => {
        const result = await client2.outgoingRequests.createRequest({
            content: {
                items: [
                    {
                        // "@type": "TestRequestItem",
                        mustBeAccepted: false
                    }
                ],
                expiresAt: DateTime.now().plus({ hour: 1 }).toISO()
            },
            peer: (await client1.account.getIdentityInfo()).result.address
        });

        expect(result.isSuccess).toBeTruthy();

        const sConsumptionRequest = (await client2.outgoingRequests.getRequest(result.result.id)).result;
        expect(sConsumptionRequest.status).toBe(ConnectorRequestStatus.Draft);
        expect(sConsumptionRequest.content.items).toHaveLength(1);
        expect(sConsumptionRequest.content.items[0]["@type"]).toBe("RequestItem");
        expect(sConsumptionRequest.content.items[0].mustBeAccepted).toBe(false);
    });
});
