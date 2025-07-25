import { DataEvent } from "@js-soft/ts-utils";
import { ConnectorHttpResponse, CreateRepositoryAttributeRequest, LocalAttributeDeletionStatus, LocalAttributeDTO, SucceedAttributeRequest } from "@nmshd/connector-sdk";
import { GivenNameJSON, RelationshipAttributeConfidentiality } from "@nmshd/content";
import { ConnectorClientWithMetadata, Launcher } from "./lib/Launcher";
import { QueryParamConditions } from "./lib/QueryParamConditions";
import { getTimeout } from "./lib/setTimeout";
import {
    connectAndEmptyCollection,
    createRepositoryAttribute,
    deleteAllAttributes,
    establishRelationship,
    executeFullCreateAndShareRelationshipAttributeFlow,
    executeFullCreateAndShareRepositoryAttributeFlow,
    syncUntilHasMessages,
    syncUntilHasMessageWithNotification,
    syncUntilHasMessageWithResponse,
    syncUntilHasRequest
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

beforeEach(async () => {
    await deleteAllAttributes(client1, client1Address);
    await deleteAllAttributes(client2, client2Address);
    client1._eventBus?.reset();
    client2._eventBus?.reset();
});

describe("Attributes", () => {
    test("should check if a repository attribute can be created", async () => {
        const canCreateAttributeResponse = await client1.attributes.canCreateRepositoryAttribute({
            content: {
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                },
                tags: ["content:edu.de"]
            }
        });

        expect(canCreateAttributeResponse.result.isSuccess).toBe(true);
    });

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

        expect(createAttributeResponse).toBeSuccessful();
    });

    test("should not set isDefault creating new RepositoryAttributes", async () => {
        const repositoryAttribute = (
            await client1.attributes.createRepositoryAttribute({
                content: {
                    value: {
                        "@type": "Surname",
                        value: "ASurname"
                    }
                }
            })
        ).result;

        expect(repositoryAttribute.isDefault).toBeUndefined();
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
        expect(getAttributeResponse).toBeSuccessful();
    });

    test("should get the created attribute in the list of attributes", async () => {
        const getAttributesResponse = await client1.attributes.getAttributes({});
        expect(getAttributesResponse).toBeSuccessful();
    });

    test("should get the created attribute in the list of valid attributes", async () => {
        const getAttributesResponse = await client1.attributes.getValidAttributes({});
        expect(getAttributesResponse).toBeSuccessful();
    });

    test("should succeed a Repository Attribute", async () => {
        const newRepositoryAttribute: CreateRepositoryAttributeRequest = {
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
                    value: "ANewGivenName"
                },
                tags: ["content:edu.de"]
            }
        });

        expect(succeedAttributeResponse).toBeSuccessful(ValidationSchema.SucceedAttributeResponse);

        const succeededAttribute = (await client1.attributes.getAttribute(succeedAttributeResponse.result.successor.id)).result;

        expect(succeededAttribute.content).toStrictEqualExcluding(newRepositoryAttribute.content, "@type", "owner", "value.value");
        expect((succeededAttribute.content.value as GivenNameJSON).value).toBe("ANewGivenName");
    });

    test("Should notify peer about Repository Attribute Succession", async () => {
        const ownSharedIdentityAttribute = await executeFullCreateAndShareRepositoryAttributeFlow(client1, client2, {
            "@type": "GivenName",
            value: "AGivenName"
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
        await client2._eventBus!.waitForEvent<DataEvent<any>>("consumption.peerSharedAttributeSucceeded", (event: DataEvent<any>) => {
            return event.data.successor.id === notificationResponse.result.successor.id;
        });

        const succeededAttributeResponse = await client2.attributes.getAttribute(notificationResponse.result.successor.id);

        expect(notificationResponse.result.successor.content.value).toStrictEqual(succeededAttributeResponse.result.content.value);
    });

    test("Should succeed a Relationship Attribute", async () => {
        const attribute = await executeFullCreateAndShareRelationshipAttributeFlow(client1, client2, {
            value: {
                "@type": "ProprietaryString",
                title: "text",
                value: "AGivenName"
            },
            key: "key",
            confidentiality: RelationshipAttributeConfidentiality.Public
        });

        const successionAttribute: SucceedAttributeRequest = {
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
        await client2._eventBus!.waitForEvent<DataEvent<any>>(
            "consumption.peerSharedAttributeSucceeded",
            (event) => event.data.successor.id === successionResponse.result.successor.id
        );

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

        await conditions.executeTests((c, q) => c.attributes.getAttributes(q));
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

        await conditions.executeTests((c, q) => c.attributes.getValidAttributes(q));
    });

    test("should query own shared identity attributes", async () => {
        const attribute = await executeFullCreateAndShareRepositoryAttributeFlow(client1, client2, {
            "@type": "GivenName",
            value: "AGivenName"
        });

        const conditions = new QueryParamConditions(attribute, client1)
            .addStringSet("content.@type")
            .addStringArraySet("content.tags")
            .addStringSet("content.key")
            .addBooleanSet("content.isTechnical")
            .addStringSet("content.confidentiality")
            .addStringSet("content.value.@type")
            .addStringSet("shareInfo.requestReference")
            .addStringSet("shareInfo.sourceAttribute");

        await conditions.executeTests((c, q) => c.attributes.getOwnSharedIdentityAttributes({ ...q, peer: client2Address }));
    });

    test("should query peer shared identity attributes", async () => {
        const ownSharedAttribute = await executeFullCreateAndShareRepositoryAttributeFlow(client2, client1, {
            "@type": "GivenName",
            value: "AGivenName"
        });

        const peerSharedAttribute = (await client1.attributes.getAttribute(ownSharedAttribute.id)).result;

        const conditions = new QueryParamConditions(peerSharedAttribute, client1)
            .addStringSet("content.@type")
            .addStringArraySet("content.tags")
            .addStringSet("content.key")
            .addBooleanSet("content.isTechnical")
            .addStringSet("content.confidentiality")
            .addStringSet("content.value.@type")
            .addStringSet("shareInfo.requestReference");

        await conditions.executeTests((c, q) => c.attributes.getPeerSharedIdentityAttributes({ ...q, peer: client2Address }));
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
        expect(executeIdentityAttributeQueryResponse).toBeSuccessful();
        const attributes = executeIdentityAttributeQueryResponse.result;

        expect(attributes).toContainEqual(attribute);
    });

    test("should execute a RelationshipAttributeQuery", async () => {
        await executeFullCreateAndShareRelationshipAttributeFlow(client1, client2, {
            value: {
                "@type": "ProprietaryString",
                title: "text",
                value: "AGivenName"
            },
            key: "someSpecialKey",
            confidentiality: RelationshipAttributeConfidentiality.Public
        });

        const executeRelationshipAttributeQueryResponse = await client2.attributes.executeRelationshipAttributeQuery({
            query: {
                key: "someSpecialKey",
                owner: client1Address,
                attributeCreationHints: {
                    valueType: "ProprietaryString",
                    title: "text",
                    confidentiality: RelationshipAttributeConfidentiality.Public
                }
            }
        });

        expect(executeRelationshipAttributeQueryResponse).toBeSuccessful();

        expect((executeRelationshipAttributeQueryResponse.result.content.value as GivenNameJSON).value).toBe("AGivenName");
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
            expect(newAtt).toBeSuccessful();
        }

        await executeFullCreateAndShareRepositoryAttributeFlow(client1, client2, {
            "@type": "GivenName",
            value: "AGivenName5"
        });

        const newAttributes = await client1.attributes.getOwnRepositoryAttributes();
        expect(newAttributes.result).toHaveLength(6);
    });

    test("should get all the latest repository attributes only", async () => {
        const attributesResponse = await client1.attributes.getOwnRepositoryAttributes({});
        expect(attributesResponse.result).toHaveLength(0);

        const numberOfAttributes = 5;
        let newAttributeResponse: ConnectorHttpResponse<LocalAttributeDTO>;
        for (let i = 0; i < numberOfAttributes; i++) {
            newAttributeResponse = await client1.attributes.createRepositoryAttribute({
                content: {
                    value: {
                        "@type": "GivenName",
                        value: `AGivenName${i}`
                    }
                }
            });
            expect(newAttributeResponse).toBeSuccessful();
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
            "@type": "GivenName",
            value: "ANewGivenName"
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
            "@type": "GivenName",
            value: "AGivenName"
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
            "@type": "GivenName",
            value: "AGivenName"
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

        const allSharedVersions = await client1.attributes.getSharedVersionsOfAttribute(initialRepositoryAttributeId, {
            onlyLatestVersions: false
        });
        expect(allSharedVersions.result).toHaveLength(12);

        const allOfMultiplePeersSharedVersions = await client1.attributes.getSharedVersionsOfAttribute(initialRepositoryAttributeId, {
            onlyLatestVersions: false,
            peers: [client2Address, client3Address]
        });

        expect(allOfMultiplePeersSharedVersions.result).toHaveLength(12);
        const allOfOnePeersSharedVersions = await client1.attributes.getSharedVersionsOfAttribute(initialRepositoryAttributeId, {
            onlyLatestVersions: false,
            peers: [client2Address]
        });

        expect(allOfOnePeersSharedVersions.result).toHaveLength(6);
        const latestOfAllPeersSharedVersions = await client1.attributes.getSharedVersionsOfAttribute(initialRepositoryAttributeId, {
            onlyLatestVersions: true,
            peers: [client2Address, client3Address]
        });

        expect(latestOfAllPeersSharedVersions.result).toHaveLength(2);

        newLauncher.stop();
    });
});

describe("Delete attributes", () => {
    test("should delete an own shared attribute and notify peer", async () => {
        const ownSharedIdentityAttribute = await executeFullCreateAndShareRepositoryAttributeFlow(client1, client2, {
            "@type": "GivenName",
            value: "AGivenName"
        });
        const repositoryAttributeId = ownSharedIdentityAttribute.shareInfo!.sourceAttribute!;

        const deleteResponse = await client1.attributes.deleteOwnSharedAttributeAndNotifyPeer(ownSharedIdentityAttribute.id);
        expect(deleteResponse.isSuccess).toBe(true);
        await syncUntilHasMessageWithNotification(client2, deleteResponse.result.notificationId);
        await client2._eventBus!.waitForEvent<DataEvent<LocalAttributeDTO>>("consumption.ownSharedAttributeDeletedByOwner", (event: any) => {
            return event.data.id === ownSharedIdentityAttribute.id;
        });

        const client1DeletedAttribute = await client1.attributes.getAttribute(ownSharedIdentityAttribute.id);
        expect(client1DeletedAttribute.isSuccess).toBe(false);
        const client2DeletedAttribute = await client2.attributes.getAttribute(ownSharedIdentityAttribute.id);
        expect(client2DeletedAttribute.result.deletionInfo?.deletionStatus).toBe(LocalAttributeDeletionStatus.DeletedByOwner);
        const client1RepositoryAttribute = await client1.attributes.getAttribute(repositoryAttributeId);
        expect(client1RepositoryAttribute.isSuccess).toBe(true);
    });

    test("should delete an peer shared attribute and notify owner", async () => {
        const ownSharedIdentityAttribute = await executeFullCreateAndShareRepositoryAttributeFlow(client1, client2, {
            "@type": "GivenName",
            value: "AGivenName"
        });
        const repositoryAttributeId = ownSharedIdentityAttribute.shareInfo!.sourceAttribute!;

        const deleteResponse = await client2.attributes.deletePeerSharedAttributeAndNotifyOwner(ownSharedIdentityAttribute.id);
        expect(deleteResponse.isSuccess).toBe(true);
        await syncUntilHasMessageWithNotification(client1, deleteResponse.result.notificationId);
        await client1._eventBus!.waitForEvent<DataEvent<LocalAttributeDTO>>("consumption.peerSharedAttributeDeletedByPeer", (event: any) => {
            return event.data.id === ownSharedIdentityAttribute.id;
        });

        const client2DeletedAttribute = await client2.attributes.getAttribute(ownSharedIdentityAttribute.id);
        expect(client2DeletedAttribute.isSuccess).toBe(false);
        const client1DeletedAttribute = await client1.attributes.getAttribute(ownSharedIdentityAttribute.id);
        expect(client1DeletedAttribute.result.deletionInfo?.deletionStatus).toBe(LocalAttributeDeletionStatus.DeletedByPeer);
        const client2RepositoryAttribute = await client1.attributes.getAttribute(repositoryAttributeId);
        expect(client2RepositoryAttribute.isSuccess).toBe(true);
    });
    test("should delete a repository attribute", async () => {
        const attribute = await client1.attributes.createRepositoryAttribute({
            content: {
                value: {
                    "@type": "GivenName",
                    value: "AGivenName"
                }
            }
        });

        const deleteResponse = await client1.attributes.deleteRepositoryAttribute(attribute.result.id);
        expect(deleteResponse.isSuccess).toBe(true);
        const getAttributeResponse = await client1.attributes.getAttribute(attribute.result.id);
        expect(getAttributeResponse.isSuccess).toBe(false);
    });

    test("should delete a ThirdPartyRelationshipAttribute and notify the peer", async () => {
        const [client3] = await launcher.launch(1);

        await establishRelationship(client3, client2);

        const ownSharedIdentityAttribute = await executeFullCreateAndShareRelationshipAttributeFlow(client1, client2, {
            value: {
                "@type": "ProprietaryString",
                title: "text",
                value: "ANewGivenName"
            },
            key: "randomKey",
            confidentiality: RelationshipAttributeConfidentiality.Public
        });

        const outgoingRequests = await client3.outgoingRequests.createRequest({
            content: {
                items: [
                    {
                        "@type": "ReadAttributeRequestItem",
                        query: {
                            "@type": "ThirdPartyRelationshipAttributeQuery",
                            key: "randomKey",
                            owner: "",
                            thirdParty: [client1Address]
                        },
                        mustBeAccepted: true
                    }
                ]
            },
            peer: client2Address
        });

        await client3.messages.sendMessage({
            recipients: [client2Address],
            content: outgoingRequests.result.content
        });

        await syncUntilHasRequest(client2, outgoingRequests.result.id);
        await client2._eventBus?.waitForEvent<DataEvent<any>>("consumption.incomingRequestStatusChanged", (event) => {
            // eslint-disable-next-line jest/no-conditional-in-test
            return event.data.request.id.toString() === outgoingRequests.result.id && event.data.newStatus === "ManualDecisionRequired";
        });

        await client2.incomingRequests.accept(outgoingRequests.result.id, {
            items: [
                {
                    accept: true,
                    existingAttributeId: ownSharedIdentityAttribute.id
                }
            ]
        });

        const message = await syncUntilHasMessageWithResponse(client3, outgoingRequests.result.id);
        await client3._eventBus?.waitForEvent<DataEvent<any>>("consumption.outgoingRequestStatusChanged", (event) => {
            // eslint-disable-next-line jest/no-conditional-in-test
            return event.data.request.id.toString() === outgoingRequests.result.id && event.data.newStatus === "Completed";
        });

        const thirdPartyRelationshipAttribute = (await client3.attributes.getAttribute((message.content as any).response.items[0].attributeId)).result;

        const deleteResponse = await client3.attributes.deleteThirdPartyRelationshipAttributeAndNotifyPeer(thirdPartyRelationshipAttribute.id);

        await syncUntilHasMessageWithNotification(client2, deleteResponse.result.notificationId);
        await client2._eventBus?.waitForEvent<DataEvent<any>>("consumption.thirdPartyRelationshipAttributeDeletedByPeer", (event) => {
            return event.data.id.toString() === thirdPartyRelationshipAttribute.id;
        });

        const client3DeletedAttribute = await client3.attributes.getAttribute(thirdPartyRelationshipAttribute.id);
        expect(client3DeletedAttribute.isError).toBe(true);
    });
});

describe("Attributes Tag Collection", () => {
    test("should get all valid tags", async () => {
        const response = await client1.attributes.getAttributeTagCollection();
        expect(response).toBeSuccessful();
    });
});
