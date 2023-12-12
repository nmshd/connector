import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { createIdentityAttribute, establishRelationship, syncUntilHasMessages } from "./lib/testUtils";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;
let client2Address: string;

beforeAll(async () => {
    [client1, client2] = await launcher.launch(2);
    await establishRelationship(client1, client2);
    client2Address = (await client2.account.getIdentityInfo()).result.address;
}, 30000);
afterAll(() => launcher.stop());

describe("Attributes", () => {
    let attributeId: string;

    test("should create an attribute", async () => {
        const createAttributeResponse = await client1.attributes.createIdentityAttribute({
            value: {
                "@type": "GivenName",
                value: "AGivenName"
            },
            tags: ["content:edu.de"]
        });

        expect(createAttributeResponse).toBeSuccessful(ValidationSchema.ConnectorAttribute);

        attributeId = createAttributeResponse.result.id;
    });

    test("should get the created attribute", async () => {
        const getAttributeResponse = await client1.attributes.getAttribute(attributeId);
        expect(getAttributeResponse).toBeSuccessful(ValidationSchema.ConnectorAttribute);
    });

    test("should get the created attribute in the list of attributes", async () => {
        const getAttributesResponse = await client1.attributes.getAttributes({});
        expect(getAttributesResponse).toBeSuccessful(ValidationSchema.ConnectorAttributes);
    });

    test("should get the created attribute in the list of valid attributes", async () => {
        const getAttributesResponse = await client1.attributes.getValidAttributes({});
        expect(getAttributesResponse).toBeSuccessful(ValidationSchema.ConnectorAttributes);
    });
});

describe("Attributes Query", () => {
    test("should query attributes", async () => {
        const attribute = (
            await client1.attributes.createIdentityAttribute({
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                }
            })
        ).result;

        const conditions = new QueryParamConditions(attribute, client1)
            .addDateSet("createdAt")
            .addStringSet("content.@type")
            .addStringArraySet("content.tags")
            .addStringSet("content.owner")
            .addDateSet("content.validFrom")
            .addDateSet("content.validTo")
            .addStringSet("content.key")
            .addBooleanSet("content.isTechnical")
            .addStringSet("content.confidentiality")
            .addStringSet("content.value.@type")
            .addStringSet("succeeds")
            .addStringSet("succeededBy")
            .addStringSet("shareInfo.requestReference")
            .addStringSet("shareInfo.peer")
            .addStringSet("shareInfo.sourceAttribute");

        await conditions.executeTests((c, q) => c.attributes.getAttributes(q), ValidationSchema.ConnectorAttributes);
    });

    test("should query valid attributes", async () => {
        const attribute = (
            await client1.attributes.createIdentityAttribute({
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                }
            })
        ).result;

        const conditions = new QueryParamConditions(attribute, client1)
            .addStringSet("content.@type")
            .addStringArraySet("content.tags")
            .addStringSet("content.owner")
            .addStringSet("content.key")
            .addBooleanSet("content.isTechnical")
            .addStringSet("content.confidentiality")
            .addStringSet("content.value.@type")
            .addStringSet("succeeds")
            .addStringSet("succeededBy")
            .addStringSet("shareInfo.requestReference")
            .addStringSet("shareInfo.peer")
            .addStringSet("shareInfo.sourceAttribute");

        await conditions.executeTests((c, q) => c.attributes.getValidAttributes(q), ValidationSchema.ConnectorAttributes);
    });
});

describe("Execute AttributeQueries", () => {
    test("should execute an IdentityAttributeQuery", async () => {
        const attribute = await createIdentityAttribute(client1, {
            value: {
                "@type": "GivenName",
                value: "AGivenName"
            }
        });

        const executeIdentityAttributeQueryResult = await client1.attributes.executeIdentityAttributeQuery({ query: { valueType: "GivenName" } });
        expect(executeIdentityAttributeQueryResult).toBeSuccessful(ValidationSchema.ConnectorAttributes);
        const attributes = executeIdentityAttributeQueryResult.result;

        expect(attributes).toContainEqual(attribute);
    });

    // TODO: requires an active relationship and an accept from peer before relationship attribute can be queried
    // test("should execute a RelationshipAttributeQuery", async () => {
    //     await createRelationshipAttribute(client1, {
    //         content: {
    //             value: {
    //                 "@type": "ProprietaryString",
    //                 title: "ATitle",
    //                 value: "AString"
    //             },
    //             key: "AKey",
    //             confidentiality: "public"
    //         },
    //         peer: "peer"
    //     });

    //     const executeRelationshipAttributeQueryResult = await client1.attributes.executeRelationshipAttributeQuery({
    //         query: {
    //             key: "AKey",
    //             owner: client1Address,
    //             attributeCreationHints: {
    //                 valueType: "ProprietaryString",
    //                 title: "A title",
    //                 confidentiality: "public"
    //             }
    //         }
    //     });
    //     expect(executeRelationshipAttributeQueryResult).toBeSuccessful(ValidationSchema.ConnectorAttribute);

    //     expect(executeRelationshipAttributeQueryResult.result.content.value.value).toBe("AString");
    // });

    describe("Create Identity Attribute", () => {
        test("Should share an Identity Attribute", async () => {
            const attribute = await client1.attributes.createIdentityAttribute({
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                }
            });

            expect(attribute.isSuccess).toBe(true);
        });
    });

    describe("Create and share Relationship Attribute", () => {
        test("Should share an Identity Attribute", async () => {
            const createRequest = await client1.attributes.createAndShareRelationshipAttribute({
                content: {
                    value: {
                        "@type": "ProprietaryString",
                        title: "text",
                        value: "AGivenName"
                    },
                    key: "key",
                    confidentiality: "public"
                },
                peer: client2Address
            });

            expect(createRequest.isSuccess).toBe(true);

            await syncUntilHasMessages(client2);

            await client2.incomingRequests.accept(createRequest.result.id, { items: [{ accept: true }] });

            await syncUntilHasMessages(client1);

            const request = await client1.outgoingRequests.getRequest(createRequest.result.id);

            expect(request.result.status).toBe("Completed");

            // TODO: validate that shared attribute is correctly created on side of client 2
        });
    });

    describe("Share Identity Attribute", () => {
        test("Should share an Identity Attribute", async () => {
            const attribute = (
                await client1.attributes.createIdentityAttribute({
                    value: {
                        "@type": "GivenName",
                        value: "AGivenName"
                    }
                })
            ).result;

            const result = await client1.attributes.shareIdentityAttribute({ attributeId: attribute.id, peer: client2Address });
            expect(result.isSuccess).toBe(true);
            // TODO: validate that shared attribute is correctly created on side of client 2
        });
    });

    describe("Notify peer about Identity Attribute Succession", () => {
        test("Should notify peer about Identity Attribute Succession", async () => {
            const attribute = (
                await client1.attributes.createIdentityAttribute({
                    value: {
                        "@type": "GivenName",
                        value: "AGivenName"
                    }
                })
            ).result;

            const shareRequest = await client1.attributes.shareIdentityAttribute({ attributeId: attribute.id, peer: client2Address });

            expect(shareRequest.isSuccess).toBe(true);

            await syncUntilHasMessages(client2);

            await client2.incomingRequests.accept(shareRequest.result.id, { items: [{ accept: true }] });

            await syncUntilHasMessages(client1);

            const successionResponse = await client1.attributes.succeedIdentityAttribute({
                predecessorId: attribute.id,
                successorContent: {
                    value: {
                        "@type": "GivenName",
                        value: "ANewGivenName"
                    }
                }
            });

            expect(successionResponse.isSuccess).toBe(true);

            const notificationResult = await client1.attributes.notifyPeerAboutIdentityAttributeSuccession({
                attributeId: successionResponse.result.successor.id,
                peer: client2Address
            });

            expect(notificationResult.isSuccess).toBe(true);

            // TODO: validate succession on side of client 2
        });
    });

    describe("Succeed Identity Attribute", () => {
        test("Should succeed an Identity Attribute", async () => {
            const createAttributeResponse = await client1.attributes.createIdentityAttribute({
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                },
                tags: ["content:edu.de"]
            });

            const attributeId = createAttributeResponse.result.id;

            const succeedAttributeResponse = await client1.attributes.succeedIdentityAttribute({
                predecessorId: attributeId,
                successorContent: {
                    value: {
                        "@type": "GivenName",
                        value: "AGivenName"
                    },
                    tags: ["content:edu.de"]
                }
            });

            expect(succeedAttributeResponse.isSuccess).toBe(true);

            // TODO: validate succession on side of client 2
        });
    });

    describe("Succeed Relationship Attribute", () => {
        test("Should succeed a Relationship Attribute", async () => {
            const createRequest = await client1.attributes.createAndShareRelationshipAttribute({
                content: {
                    value: {
                        "@type": "ProprietaryString",
                        title: "text",
                        value: "AGivenName"
                    },
                    key: "key",
                    confidentiality: "public"
                },
                peer: client2Address
            });

            await syncUntilHasMessages(client2);

            await client2.incomingRequests.accept(createRequest.result.id, { items: [{ accept: true }] });

            const message = await syncUntilHasMessages(client1);

            const request = await client1.outgoingRequests.getRequest(createRequest.result.id);

            expect(request.result.status).toBe("Completed");

            const relationshipAttributeId = (message[0] as any).content.response.items[0].attributeId; // TODO: How to retrieve attribute id?

            const result = await client1.attributes.succeedRelationshipAttributeAndNotifyPeer({
                predecessorId: relationshipAttributeId,
                successorContent: {
                    value: {
                        "@type": "ProprietaryString",
                        title: "text",
                        value: "ANewGivenName"
                    }
                }
            });

            expect(result.isSuccess).toBe(true);

            // TODO: validate succession on side of client 2
        });
    });
});
