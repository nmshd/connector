import { DataEvent } from "@js-soft/ts-utils";
import { ConnectorAttribute, ConnectorRelationshipAttribute, ConnectorResponse } from "@nmshd/connector-sdk";
import { SuccessionEventData } from "@nmshd/runtime";
import { ConnectorClientWithMetadata, Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { getTimeout } from "./lib/setTimeout";
import {
    connectAndEmptyCollection,
    createRepositoryAttribute,
    establishRelationship,
    executeFullCreateAndShareRelationshipAttributeFlow,
    executeFullCreateAndShareRepositoryAttributeFlow,
    syncUntilHasMessageWithNotification,
    syncUntilHasMessages
} from "./lib/testUtils";
import { ValidationSchema } from "./lib/validation";

const launcher = new Launcher();
let client1: ConnectorClientWithMetadata;
let client2: ConnectorClientWithMetadata;
let client1Address: string;
let client2Address: string;

beforeAll(async () => {
    [client1, client2] = await launcher.launch(2);
    await establishRelationship(client1, client2);
    client1Address = (await client1.account.getIdentityInfo()).result.address;
    client2Address = (await client2.account.getIdentityInfo()).result.address;
}, getTimeout(30000));
afterAll(() => launcher.stop());

beforeEach(() => {
    client1._eventBus?.reset();
    client2._eventBus?.reset();
});

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

        expect(succeedAttributeResponse).toBeSuccessful(ValidationSchema.SucceedAttributeResponse);

        const succeededAttribute = (await client1.attributes.getAttribute(succeedAttributeResponse.result.successor.id)).result;

        expect(succeededAttribute.content).toStrictEqualExcluding(newRepositoryAttribute.content, "@type", "owner");
    });

    test("Should notify peer about Repository Attribute Succession", async () => {
        const ownSharedIdentityAttribute = await executeFullCreateAndShareRepositoryAttributeFlow(client1, client2, {
            "@type": "IdentityAttribute",
            owner: client1Address,
            value: {
                "@type": "GivenName",
                value: "AGivenName"
            }
        });

        expect(ownSharedIdentityAttribute.shareInfo?.sourceAttribute).toBeDefined();

        const ownUnsharedRepositoryAttribute = await client1.attributes.getAttribute(ownSharedIdentityAttribute.shareInfo!.sourceAttribute!);

        const successionResponse = await client1.attributes.succeedAttribute(ownUnsharedRepositoryAttribute.result.id, {
            successorContent: {
                value: {
                    "@type": "GivenName",
                    value: "ANewGivenName"
                }
            }
        });
        expect(successionResponse.isSuccess).toBe(true);
        const notificationResponse = await client1.attributes.notifyPeerAboutRepositoryAttributeSuccession(successionResponse.result.successor.id, {
            peer: client2Address
        });
        expect(notificationResponse.isSuccess).toBe(true);

        await syncUntilHasMessageWithNotification(client2, notificationResponse.result.notificationId);
        await client2._eventBus!.waitForEvent<DataEvent<any>>("consumption.peerSharedAttributeSucceeded", (event: DataEvent<SuccessionEventData>) => {
            return event.data.successor.id === notificationResponse.result.successor.id;
        });

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
                    },
                    tags: ["content:edu.de"]
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
            key: "someSpecialKey",
            confidentiality: "public"
        };
        await executeFullCreateAndShareRelationshipAttributeFlow(client1, client2, attributeContent);

        const executeRelationshipAttributeQueryResponse = await client2.attributes.executeRelationshipAttributeQuery({
            query: {
                key: "someSpecialKey",
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

describe("Read Attribute and versions", () => {
    beforeEach(async () => {
        await connectAndEmptyCollection(client1._metadata!.accountName, "Attributes");
        await connectAndEmptyCollection(client2._metadata!.accountName, "Attributes");
    });

    test("should get all the repository attributes only", async () => {
        const attributes = await client1.attributes.getOwnRepositoryAttributes({});
        expect(attributes.result).toHaveLength(0);

        const numberOfAttributes = 5;
        for (let i = 0; i < numberOfAttributes; i++) {
            const newAtt = await client1.attributes.createRepositoryAttribute({
                content: {
                    value: {
                        "@type": "GivenName",
                        value: `AGivenName${i}`
                    }
                }
            });
            expect(newAtt).toBeSuccessful(ValidationSchema.ConnectorAttribute);
        }
        await executeFullCreateAndShareRepositoryAttributeFlow(client1, client2, {
            "@type": "IdentityAttribute",
            value: {
                "@type": "GivenName",
                value: "AGivenName5"
            },
            owner: client1Address
        });

        const newAttributes = await client1.attributes.getOwnRepositoryAttributes();
        expect(newAttributes.result).toHaveLength(6);
    });

    test("should get all the latest repository attributes only", async () => {
        const attributesResponse = await client1.attributes.getOwnRepositoryAttributes({});
        expect(attributesResponse.result).toHaveLength(0);

        const numberOfAttributes = 5;
        let newAttributeResponse: ConnectorResponse<ConnectorAttribute>;
        for (let i = 0; i < numberOfAttributes; i++) {
            newAttributeResponse = await client1.attributes.createRepositoryAttribute({
                content: {
                    value: {
                        "@type": "GivenName",
                        value: `AGivenName${i}`
                    }
                }
            });
            expect(newAttributeResponse).toBeSuccessful(ValidationSchema.ConnectorAttribute);
        }

        await client1.attributes.succeedAttribute(newAttributeResponse!.result.id, {
            successorContent: {
                value: {
                    "@type": "GivenName",
                    value: "ANewGivenName"
                }
            }
        });
        const allAttributesResponse = await client1.attributes.getOwnRepositoryAttributes({ onlyLatestVersions: false });
        expect(allAttributesResponse.result).toHaveLength(6);

        const onlyLatestAttributesResponse = await client1.attributes.getOwnRepositoryAttributes({ onlyLatestVersions: true });
        expect(onlyLatestAttributesResponse.result).toHaveLength(5);
    });

    test("should get all own/peer shared identity attributes", async () => {
        await executeFullCreateAndShareRepositoryAttributeFlow(client1, client2, {
            "@type": "IdentityAttribute",
            value: {
                "@type": "GivenName",
                value: "ANewGivenName"
            },
            owner: client1Address
        });

        await client1.attributes.createRepositoryAttribute({
            content: {
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                }
            }
        });

        const ownAttributesResponse = await client1.attributes.getOwnSharedIdentityAttributes({
            peer: client2Address
        });

        const peerAttributesResponse = await client2.attributes.getPeerSharedIdentityAttributes({
            peer: client1Address
        });

        expect(ownAttributesResponse.result).toHaveLength(1);
        expect(peerAttributesResponse.result).toHaveLength(1);
    });

    test("should get the latest own/peer shared identity attributes", async () => {
        const sharedAttribute = await executeFullCreateAndShareRepositoryAttributeFlow(client1, client2, {
            "@type": "IdentityAttribute",
            value: {
                "@type": "GivenName",
                value: "AGivenName"
            },
            owner: client1Address
        });

        const succeededAttributeResponse = await client1.attributes.succeedAttribute(sharedAttribute.shareInfo!.sourceAttribute!, {
            successorContent: {
                value: {
                    "@type": "GivenName",
                    value: "ANewGivenName"
                }
            }
        });

        await client1.attributes.notifyPeerAboutRepositoryAttributeSuccession(succeededAttributeResponse.result.predecessor.id, {
            peer: client2Address
        });

        const ownAttributesResponse = await client1.attributes.getOwnSharedIdentityAttributes({
            peer: client2Address,
            onlyLatestVersions: true
        });

        const peerAttributesResponse = await client2.attributes.getPeerSharedIdentityAttributes({
            peer: client1Address,
            onlyLatestVersions: true
        });

        expect(ownAttributesResponse.result).toHaveLength(1);
        expect(peerAttributesResponse.result).toHaveLength(1);
    });

    test("should get all local/shard versions of an attribute", async () => {
        const newLauncher = new Launcher();
        const [client3] = await newLauncher.launch(1);
        await establishRelationship(client1, client3);
        const client3Address = (await client3.account.getIdentityInfo()).result.address;
        const newAttributeResponse = await executeFullCreateAndShareRepositoryAttributeFlow(client1, [client2, client3], {
            "@type": "IdentityAttribute",
            value: {
                "@type": "GivenName",
                value: "AGivenName"
            },
            owner: client1Address
        });
        const numberOfSuccessions = 5;
        const initialRepositoryAttributeId = newAttributeResponse[0].shareInfo!.sourceAttribute!;
        let latestSuccessionId = initialRepositoryAttributeId;

        for (let i = 0; i < numberOfSuccessions; i++) {
            const successionResponse = await client1.attributes.succeedAttribute(latestSuccessionId, {
                successorContent: {
                    value: {
                        "@type": "GivenName",
                        value: `AGivenName${i}`
                    }
                }
            });
            latestSuccessionId = successionResponse.result.successor.id;
            await client1.attributes.notifyPeerAboutRepositoryAttributeSuccession(successionResponse.result.successor.id, {
                peer: client2Address
            });
            await client1.attributes.notifyPeerAboutRepositoryAttributeSuccession(successionResponse.result.successor.id, {
                peer: client3Address
            });
        }

        const allVersions = await client1.attributes.getVersionsOfAttribute(initialRepositoryAttributeId);
        expect(allVersions.result).toHaveLength(6);

        const allSharedVersions = await client1.attributes.getSharedVersionsOfRepositoryAttribute(initialRepositoryAttributeId, {
            onlyLatestVersions: false
        });
        expect(allSharedVersions.result).toHaveLength(12);

        const allOfMultiplePeersSharedVersions = await client1.attributes.getSharedVersionsOfRepositoryAttribute(initialRepositoryAttributeId, {
            onlyLatestVersions: false,
            peers: [client2Address, client3Address]
        });

        expect(allOfMultiplePeersSharedVersions.result).toHaveLength(12);
        const allOfOnePeersSharedVersions = await client1.attributes.getSharedVersionsOfRepositoryAttribute(initialRepositoryAttributeId, {
            onlyLatestVersions: false,
            peers: [client2Address]
        });

        expect(allOfOnePeersSharedVersions.result).toHaveLength(6);
        const latestOfAllPeersSharedVersions = await client1.attributes.getSharedVersionsOfRepositoryAttribute(initialRepositoryAttributeId, {
            onlyLatestVersions: true,
            peers: [client2Address, client3Address]
        });

        expect(latestOfAllPeersSharedVersions.result).toHaveLength(2);

        newLauncher.stop();
    });
});
