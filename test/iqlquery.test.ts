import { ConnectorClient, ConnectorIdentityAttribute, ExecuteIQLQueryRequest, IQLQuery, ProposeAttributeRequestItem, ReadAttributeRequestItem } from "@nmshd/connector-sdk";
import { DateTime } from "luxon";
import { Launcher } from "./lib/Launcher";
import { getTemplateToken, syncUntil, syncUntilHasMessages, syncUntilHasRelationships } from "./lib/testUtils";

/* Disable timeout errors if we're debugging */
if (process.env.NODE_OPTIONS !== undefined && process.env.NODE_OPTIONS.search("inspect") !== -1) {
    jest.setTimeout(1e9);
}

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;
let client1Address: string;
let attributes: ConnectorIdentityAttribute[];
let attributeIds: string[];

beforeAll(async () => {
    [client1, client2] = await launcher.launch(2);
    client1Address = (await client1.account.getIdentityInfo()).result.address;

    /* Create some attributes on C1. */
    attributes = [
        {
            "@type": "IdentityAttribute",
            owner: client1Address,
            value: {
                "@type": "GivenName",
                value: "AGivenName"
            },
            tags: ["language:en"]
        },
        {
            "@type": "IdentityAttribute",
            owner: client1Address,
            value: {
                "@type": "GivenName",
                value: "AGivenName"
            },
            tags: ["language:de", "content:edu.de.higher"]
        }
    ];
    attributeIds = [];
    for (const attribute of attributes) {
        const attributeId = (await client1.attributes.createAttribute({ content: attribute })).result.id;
        attributeIds.push(attributeId);
    }

    /* Initialize relationship. */
    const token = await getTemplateToken(client1);
    const templateId = (await client2.relationshipTemplates.loadPeerRelationshipTemplate({ reference: token.truncatedReference })).result.id;
    await client2.relationships.createRelationship({ templateId, content: { a: "b" } });
    for (const c of [client1, client2]) {
        const relationships = await syncUntilHasRelationships(c);
        const relationshipId = relationships[0].id;
        const relationshipChangeId = relationships[0].changes[0].id;
        await c.relationships.acceptRelationshipChange(relationshipId, relationshipChangeId, { content: { a: "b" } });
    }
    const relId1 = (await client1.relationships.getRelationships()).result[0].id;
    const relId2 = (await client2.relationships.getRelationships()).result[0].id;
    if (relId1 !== relId2) {
        /* Sanity check */
        throw new Error("Connector relationship bootstrap failed :(");
    }
}, 3000000);
afterAll(() => launcher.stop());

test("Local IQL Query", async () => {
    const table = [
        { iqlQuery: "#content:edu.de.higher", matches: [1] },
        { iqlQuery: "#content:edu.de.higher || #language:en", matches: [0, 1] },
        { iqlQuery: "#content:edu.de.higher && ( #language:de || #language:en )", matches: [1] }
    ];

    for (const e of table) {
        const queryRequest: ExecuteIQLQueryRequest = {
            query: {
                queryString: e.iqlQuery
            }
        };

        const response = await client1.attributes.executeIQLQuery(queryRequest);
        const matchedAttributeIds: string[] = response.result.map((e: any) => e.id);
        const expectedAttributeIds: string[] = e.matches.map((ii: number) => attributeIds[ii]); // eslint-disable-line no-loop-func
        expect([...matchedAttributeIds].sort()).toStrictEqual([...expectedAttributeIds].sort());
    }
});

test("Remote ReadAttributeRequest containing IQL Query", async () => {
    const table = [
        { iqlQuery: "#content:edu.de.higher", matches: 1 },
        { iqlQuery: "#content:edu.de.higher && ( #language:de || #language:en )", matches: 1 }
    ];

    /* Create request on C2. */
    const outRequest: ReadAttributeRequestItem = {
        "@type": "ReadAttributeRequestItem",
        mustBeAccepted: false,
        query: {
            "@type": "IQLQuery",
            queryString: table[0].iqlQuery
        }
    };
    const createRequestRes = await client2.outgoingRequests.createRequest({
        content: {
            items: [outRequest],
            expiresAt: DateTime.now().plus({ hour: 1 }).toISO() as any
        },
        peer: client1Address
    });
    const requestId = createRequestRes.result.id;

    /* Send request via message from C2 to C1 and wait for it to arrive. */
    const requestMessageId = (await client2.messages.sendMessage({ recipients: [client1Address], content: createRequestRes.result.content })).result.id;
    await syncUntil(client1, (context) => {
        return context.messages.some((m) => m.id === requestMessageId);
    });

    /* Extract and execute IQL query on C1. */
    const incomingRequest = (await client1.incomingRequests.getRequest(requestId)).result;
    const iqlQueryString = ((incomingRequest.content.items[0] as ReadAttributeRequestItem).query as IQLQuery).queryString;
    const matchedAttributes = (
        await client1.attributes.executeIQLQuery({
            query: {
                queryString: iqlQueryString
            }
        })
    ).result;

    /* Reply to the response with the first matched attribute. Wait on C2 for
     * the message to arrive. */
    const requestResponse = {
        items: [
            {
                accept: true,
                attributeId: matchedAttributes[0].id,
                newAttribute: matchedAttributes[0].content // why is this needed?? Test runs into timeout on syncUntilHasMessages otherwise
            }
        ]
    };
    await client1.incomingRequests.accept(incomingRequest.id, requestResponse);
    const syncRes = await syncUntilHasMessages(client2);
    const attribute = (syncRes[0] as any).content.response.items[0].attribute;
    expect(attribute).toStrictEqual(attributes[table[0].matches]);
});

test("Remote ProposeAttributeRequest containing IQL Query with existing attribute response", async () => {
    const table = [
        { iqlQuery: "#content:edu.de.higher", matches: 1 },
        { iqlQuery: "#content:edu.de.higher && ( #language:de || #language:en )", matches: 1 }
    ];

    /* Create request on C2. */
    const outRequest: ProposeAttributeRequestItem = {
        "@type": "ProposeAttributeRequestItem",
        mustBeAccepted: true,
        query: {
            "@type": "IQLQuery",
            queryString: table[0].iqlQuery
        },
        attribute: {
            "@type": "IdentityAttribute",
            owner: "",
            value: {
                "@type": "GivenName",
                value: "AnotherGivenName"
            }
        }
    };

    const createRequestRes = await client2.outgoingRequests.createRequest({
        content: {
            items: [outRequest],
            expiresAt: DateTime.now().plus({ hour: 1 }).toISO() as any
        },
        peer: client1Address
    });
    const requestId = createRequestRes.result.id;

    /* Send request via message from C2 to C1 and wait for it to arrive. */
    const requestMessageId = (await client2.messages.sendMessage({ recipients: [client1Address], content: createRequestRes.result.content })).result.id;
    await syncUntil(client1, (context) => {
        return context.messages.some((m) => m.id === requestMessageId);
    });

    /* Extract and execute IQL query on C1. */
    const incomingRequest = (await client1.incomingRequests.getRequest(requestId)).result;
    const iqlQueryString = ((incomingRequest.content.items[0] as ReadAttributeRequestItem).query as IQLQuery).queryString;
    const matchedAttributes = (
        await client1.attributes.executeIQLQuery({
            query: {
                queryString: iqlQueryString
            }
        })
    ).result;

    /* Reply to the response with the first matched attribute. Wait on C2 for
     * the message to arrive. */
    const requestResponse = {
        items: [
            {
                accept: true,
                attributeId: matchedAttributes[0].id
            }
        ]
    };
    await client1.incomingRequests.accept(incomingRequest.id, requestResponse);
    const syncRes = await syncUntilHasMessages(client2);
    const attribute = (syncRes[0] as any).content.response.items[0].attribute;
    expect(attribute).toStrictEqual(attributes[table[0].matches]);
});

test("Remote ProposeAttributeRequest containing IQL Query without existing attribute response", async () => {
    /* Create request on C2. */
    const outRequest: ProposeAttributeRequestItem = {
        "@type": "ProposeAttributeRequestItem",
        mustBeAccepted: true,
        query: {
            "@type": "IQLQuery",
            queryString: "#notfound"
        },
        attribute: {
            "@type": "IdentityAttribute",
            owner: "",
            value: {
                "@type": "GivenName",
                value: "AnotherGivenName"
            }
        }
    };
    const createRequestRes = await client2.outgoingRequests.createRequest({
        content: {
            items: [outRequest],
            expiresAt: DateTime.now().plus({ hour: 1 }).toISO() as any
        },
        peer: client1Address
    });
    const requestId = createRequestRes.result.id;

    /* Send request via message from C2 to C1 and wait for it to arrive. */
    const requestMessageId = (await client2.messages.sendMessage({ recipients: [client1Address], content: createRequestRes.result.content })).result.id;
    await syncUntil(client1, (context) => {
        return context.messages.some((m) => m.id === requestMessageId);
    });

    /* Extract and execute IQL query on C1. */
    const incomingRequest = (await client1.incomingRequests.getRequest(requestId)).result;
    const incomingRequestItem: ProposeAttributeRequestItem = incomingRequest.content.items[0] as ProposeAttributeRequestItem;
    const iqlQueryString = (incomingRequestItem.query as IQLQuery).queryString;
    const matchedAttributes = (
        await client1.attributes.executeIQLQuery({
            query: {
                queryString: iqlQueryString
            }
        })
    ).result;

    expect(matchedAttributes).toHaveLength(0);

    incomingRequestItem.attribute.owner = client1Address;

    const attributeId = (await client1.attributes.createAttribute({ content: incomingRequestItem.attribute })).result.id;

    /* Reply to the response with the first matched attribute. Wait on C2 for
     * the message to arrive. */
    const requestResponse = {
        items: [
            {
                accept: true,
                attributeId
            }
        ]
    };
    await client1.incomingRequests.accept(incomingRequest.id, requestResponse);
    const syncRes = await syncUntilHasMessages(client2);
    const attribute = (syncRes[0] as any).content.response.items[0].attribute;
    expect(attribute).toStrictEqual(incomingRequestItem.attribute);
});
