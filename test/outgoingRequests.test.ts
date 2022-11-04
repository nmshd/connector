import { ConnectorClient, ConnectorRequestStatus } from "@nmshd/connector-sdk";
import { DateTime } from "luxon";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;

beforeAll(async () => ([client1, client2] = await launcher.launch(2)), 30000);
afterAll(() => launcher.stop());

describe("Outgoing Requests", () => {
    test("sender: create an outgoing Request in status Draft", async () => {
        const response = await client2.outgoingRequests.createRequest({
            content: {
                items: [{ "@type": "ReadAttributeRequestItem", mustBeAccepted: false, query: { "@type": "IdentityAttributeQuery", valueType: "Surname" } }],
                expiresAt: DateTime.now().plus({ hour: 1 }).toISO()
            },
            peer: (await client1.account.getIdentityInfo()).result.address
        });

        expect(response).toBeSuccessful(ValidationSchema.ConnectorRequest);

        const sConsumptionRequest = (await client2.outgoingRequests.getRequest(response.result.id)).result;
        expect(sConsumptionRequest.status).toBe(ConnectorRequestStatus.Draft);
        expect(sConsumptionRequest.content.items).toHaveLength(1);
        expect(sConsumptionRequest.content.items[0]["@type"]).toBe("ReadAttributeRequestItem");
        expect(sConsumptionRequest.content.items[0].mustBeAccepted).toBe(false);
    });

    test("should query outgoing requests", async () => {
        const response = await client1.outgoingRequests.createRequest({
            content: {
                items: [{ "@type": "ReadAttributeRequestItem", mustBeAccepted: false, query: { "@type": "IdentityAttributeQuery", valueType: "Surname" } }],
                expiresAt: DateTime.now().plus({ hour: 1 }).toISO()
            },
            peer: (await client2.account.getIdentityInfo()).result.address
        });

        const conditions = new QueryParamConditions(response.result, client1)
            .addStringSet("id")
            .addStringSet("peer")
            .addDateSet("createdAt")
            .addStringSet("status")
            .addDateSet("content.expiresAt")
            .addStringSet("content.items.@type")
            .addStringSet("source.type")
            .addStringSet("source.reference")
            .addDateSet("response.createdAt")
            .addStringSet("response.source.type")
            .addStringSet("response.source.reference")
            .addBooleanSet("response.content.result")
            .addStringSet("response.content.items.@type")
            .addStringSet("response.content.items.items.@type");

        await conditions.executeTests((c, q) => c.outgoingRequests.getRequests(q), ValidationSchema.ConnectorRequests);
    });
});
