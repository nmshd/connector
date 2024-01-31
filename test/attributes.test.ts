import { ConnectorClient, ConnectorRelationshipAttribute } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import {
    createRepositoryAttribute,
    establishRelationship,
    executeFullCreateAndShareIdentityAttributeFlow,
    executeFullCreateAndShareRelationshipAttributeFlow,
    syncUntilHasMessageWithNotification,
    syncUntilHasMessages
} from "./lib/testUtils";
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
    });

    test("should get the created attribute", async () => {
        const attributeId = (
            await client1.attributes.createRepositoryAttribute({
                content: {
                    value: {
                        "@type": "GivenName",
                        value: "AGivenName"
                    },
                    tags: ["content:edu.de"]
                }
            })
        ).result.id;
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

    test("should succeed a Repository Attribute", async () => {
        const newRepositoryAttribute = {
            content: {
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                },
                tags: ["content:edu.de"]
            }
        };
        const createAttributeResponse = await client1.attributes.createRepositoryAttribute(newRepositoryAttribute);

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

        const succeededAttribute = (await client1.attributes.getAttribute(succeedAttributeResponse.result.successor.id)).result;

        expect(succeededAttribute.content).toStrictEqualExcluding(newRepositoryAttribute.content, "@type", "owner");
    });

    test("Should notify peer about Repository Attribute Succession", async () => {
        const ownSharedRepositoryAttribute = await executeFullCreateAndShareIdentityAttributeFlow(client1, client2, {
            "@type": "IdentityAttribute",
            owner: client1Address,
            value: {
                "@type": "GivenName",
                value: "AGivenName"
            }
        });

        expect(ownSharedRepositoryAttribute.shareInfo?.sourceAttribute).toBeDefined();

        const ownUnsharedRepositoryAttribute = await client1.attributes.getAttribute(ownSharedRepositoryAttribute.shareInfo!.sourceAttribute!);

        const successionResponse = await client1.attributes.succeedAttribute(ownUnsharedRepositoryAttribute.result.id, {
            successorContent: {
                value: {
                    "@type": "GivenName",
                    value: "ANewGivenName"
                }
            }
        });
        expect(successionResponse.isSuccess).toBe(true);
        const notificationResponse = await client1.attributes.notifyPeerAboutIdentityAttributeSuccession(successionResponse.result.successor.id, {
            peer: client2Address
        });
        expect(notificationResponse.isSuccess).toBe(true);

        await syncUntilHasMessageWithNotification(client2, notificationResponse.result.notificationId);

        const succeededAttributeResponse = await client2.attributes.getAttribute(notificationResponse.result.successor.id);

        expect(notificationResponse.result.successor.content.value).toStrictEqual(succeededAttributeResponse.result.content.value);
    });

    test("Should succeed a Relationship Attribute", async () => {
        const attributeContent: ConnectorRelationshipAttribute = {
            owner: client1Address,
            "@type": "RelationshipAttribute",
            value: {
                "@type": "ProprietaryString",
                title: "text",
                value: "AGivenName"
            },
            key: "key",
            confidentiality: "public"
        };
        const attribute = await executeFullCreateAndShareRelationshipAttributeFlow(client1, client2, attributeContent);

        const successionAttribute = {
            successorContent: {
                value: {
                    "@type": "ProprietaryString",
                    title: "text",
                    value: "ANewGivenName"
                }
            }
        };
        const successionResponse = await client1.attributes.succeedAttribute(attribute.id, successionAttribute);
        expect(successionResponse.isSuccess).toBe(true);

        await syncUntilHasMessages(client2);

        const client2SuccessorResponse = await client2.attributes.getAttribute(successionResponse.result.successor.id);

        expect(client2SuccessorResponse.result.content.value).toStrictEqual(successionAttribute.successorContent.value);
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

        const executeIdentityAttributeQueryResponse = await client1.attributes.executeIdentityAttributeQuery({ query: { valueType: "GivenName" } });
        expect(executeIdentityAttributeQueryResponse).toBeSuccessful(ValidationSchema.ConnectorAttributes);
        const attributes = executeIdentityAttributeQueryResponse.result;

        expect(attributes).toContainEqual(attribute);
    });

    test("should execute a RelationshipAttributeQuery", async () => {
        const attributeContent: ConnectorRelationshipAttribute = {
            owner: client1Address,
            "@type": "RelationshipAttribute",
            value: {
                "@type": "ProprietaryString",
                title: "text",
                value: "AGivenName"
            },
            key: "key",
            confidentiality: "public"
        };
        await executeFullCreateAndShareRelationshipAttributeFlow(client1, client2, attributeContent);

        const executeRelationshipAttributeQueryResponse = await client2.attributes.executeRelationshipAttributeQuery({
            query: {
                key: "key",
                owner: client1Address,
                attributeCreationHints: {
                    valueType: "ProprietaryString",
                    title: "text",
                    confidentiality: "public"
                }
            }
        });

        expect(executeRelationshipAttributeQueryResponse).toBeSuccessful(ValidationSchema.ConnectorAttribute);

        expect(executeRelationshipAttributeQueryResponse.result.content.value.value).toBe("AGivenName");
    });
});
