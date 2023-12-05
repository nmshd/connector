import { ConnectorClient } from "@nmshd/connector-sdk";
import { Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { createIdentityAttribute } from "./lib/testUtils";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClient;
let client1Address: string;

beforeAll(async () => {
    [client1] = await launcher.launch(1);
    client1Address = (await client1.account.getIdentityInfo()).result.address;
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
});
