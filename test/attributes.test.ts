import { ConnectorClient, ConnectorRelationshipAttribute } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { createRepositoryAttribute, establishRelationship, executeFullCreateAndShareRelationshipAttributeFlow } from "./lib/testUtils";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client2: ConnectorClient;
let client1Address: string;
let client2Address: string;

beforeAll(async () => {
    [client1, client2] = await launcher.launch(2);
    await establishRelationship(client1, client2);
    client1Address = (await client1.account.getIdentityInfo()).result.address;
    client2Address = (await client2.account.getIdentityInfo()).result.address;
}, 30000);
afterAll(() => launcher.stop());

describe("Attributes", () => {
    let attributeId: string;

    test("should create a repository attribute", async () => {
        const createAttributeResponse = await client1.attributes.createRepositoryAttribute({
            content: {
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                },
                tags: ["content:edu.de"]
            }
        });

        expect(createAttributeResponse).toBeSuccessful(ValidationSchema.ConnectorAttribute);

        // TODO: move to test setup function; tests must be independent of each other
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

    test("should create a Repository Attribute", async () => {
        const attribute = await client1.attributes.createRepositoryAttribute({
            content: {
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                }
            }
        });
        expect(attribute.isSuccess).toBe(true);
    });

    // TODO: fix
    // TODO: Tests lead to timout errors in the syncUntilHasMessages method => remove tests?
    //     test("Should notify peer about Identity Attribute Succession", async () => {
    //         const attribute = (
    //             await client1.attributes.createRepositoryAttribute({
    //                 content: {
    //                     value: {
    //                         "@type": "GivenName",
    //                         value: "AGivenName"
    //                     }
    //                 }
    //             })
    //         ).result;
    //         const shareRequest = await client1.attributes.shareIdentityAttribute({ attributeId: attribute.id, peer: client2Address });
    //         expect(shareRequest.isSuccess).toBe(true);
    //         await syncUntilHasMessages(client2);
    //         await client2.incomingRequests.accept(shareRequest.result.id, { items: [{ accept: true }] });
    //         await syncUntilHasMessages(client1);
    //         const successionResponse = await client1.attributes.succeedIdentityAttribute({
    //             predecessorId: attribute.id,
    //             successorContent: {
    //                 value: {
    //                     "@type": "GivenName",
    //                     value: "ANewGivenName"
    //                 }
    //             }
    //         });
    //         expect(successionResponse.isSuccess).toBe(true);
    //         const notificationResult = await client1.attributes.notifyPeerAboutIdentityAttributeSuccession({
    //             attributeId: successionResponse.result.successor.id,
    //             peer: client2Address
    //         });
    //         expect(notificationResult.isSuccess).toBe(true);
    //     });

    test("should succeed a Repository Attribute", async () => {
        const createAttributeResponse = await client1.attributes.createRepositoryAttribute({
            content: {
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                },
                tags: ["content:edu.de"]
            }
        });

        const attributeId = createAttributeResponse.result.id;

        const succeedAttributeResponse = await client1.attributes.succeedAttribute(attributeId, {
            successorContent: {
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                },
                tags: ["content:edu.de"]
            }
        });

        expect(succeedAttributeResponse.isSuccess).toBe(true);
    });

    test("Should succeed a Relationship Attribute", async () => {

        const attributeContent: Omit<ConnectorRelationshipAttribute, "owner" | "@type"> = {
            value: {
                "@type": "ProprietaryString",
                title: "text",
                value: "AGivenName"
            },
            key: "key",
            confidentiality: "public"
        };
        const attribute = await executeFullCreateAndShareRelationshipAttributeFlow(client1, client2, attributeContent)

        console.log("lol")
        // const result = await client1.attributes.succeedRelationshipAttributeAndNotifyPeer({
        //     predecessorId: relationshipAttributeId,
        //     successorContent: {
        //         value: {
        //             "@type": "ProprietaryString",
        //             title: "text",
        //             value: "ANewGivenName"
        //         }
        //     }
        // });
        // expect(result.isSuccess).toBe(true);
    });
});

describe("Attributes Query", () => {
    test("should query attributes", async () => {
        const attribute = (
            await client1.attributes.createRepositoryAttribute({
                content: {
                    value: {
                        "@type": "GivenName",
                        value: "AGivenName"
                    }
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
            await client1.attributes.createRepositoryAttribute({
                content: {
                    value: {
                        "@type": "GivenName",
                        value: "AGivenName"
                    }
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
        const attribute = await createRepositoryAttribute(client1, {
            content: {
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                }
            }
        });

        const executeIdentityAttributeQueryResult = await client1.attributes.executeIdentityAttributeQuery({ query: { valueType: "GivenName" } });
        expect(executeIdentityAttributeQueryResult).toBeSuccessful(ValidationSchema.ConnectorAttributes);
        const attributes = executeIdentityAttributeQueryResult.result;

        expect(attributes).toContainEqual(attribute);
    });

    // TODO: fix
    // test("should execute a RelationshipAttributeQuery", async () => {
    //     const createRequest = await client1.attributes.createAndShareRelationshipAttribute({
    //         content: {
    //             value: {
    //                 "@type": "ProprietaryString",
    //                 title: "ATitle",
    //                 value: "AString"
    //             },
    //             key: "AKey",
    //             confidentiality: "public"
    //         },
    //         peer: client2Address
    //     });
    //     expect(createRequest).toBeSuccessful(ValidationSchema.ConnectorRequest);

    //     await syncUntilHasMessages(client2);

    //     await client2.incomingRequests.accept(createRequest.result.id, { items: [{ accept: true }] });

    //     await syncUntilHasMessages(client1);

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
});
