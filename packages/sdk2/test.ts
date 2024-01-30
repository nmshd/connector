import { sleep } from "@js-soft/ts-utils";
import { ConnectorClient, ConnectorRelationship, ConnectorRelationshipTemplate, ConnectorSyncResult, ConnectorToken } from "@nmshd/connector-sdk";
import { DateTime } from "luxon";
import { Launcher } from "./Launcher";
import { Components, Client as ConnectorClientNew, Paths } from "./api";
import { ConnectorClient as ConnectorClient2 } from "./index";

(async function run() {
    const launcher = new Launcher();

    const newClients = await launcher.launch(2, ConnectorClient2.create);

    // const oldClients = await launcher.launch(2, ConnectorClient.create);

    // establishRelationshipOld(oldClients[0], oldClients[1]);
    await establishRelationshipNew(newClients[0], newClients[1]);
    launcher.stop();
})();

export async function establishRelationshipOld(client1: ConnectorClient, client2: ConnectorClient): Promise<void> {
    const template = await exchangeTemplate(client1, client2);

    const createRelationshipResponse = await client2.relationships.createRelationship({ templateId: template.id, content: { a: "b" } });

    const relationships = await syncUntilHasRelationships(client1);

    const acceptResponse = await client1.relationships.acceptRelationshipChange(relationships[0].id, relationships[0].changes[0].id, { content: { a: "b" } });

    const relationships2 = await syncUntilHasRelationships(client2);

    async function exchangeTemplate(clientCreator: ConnectorClient, clientRecpipient: ConnectorClient): Promise<ConnectorRelationshipTemplate> {
        const templateToken = await getTemplateToken(clientCreator);

        const response = await clientRecpipient.relationshipTemplates.loadPeerRelationshipTemplate({
            reference: templateToken.truncatedReference
        });

        return response.result;
    }

    async function getTemplateToken(client: ConnectorClient): Promise<ConnectorToken> {
        const template = await createTemplate(client);

        const response = await client.relationshipTemplates.createTokenForOwnRelationshipTemplate(template.id);

        return response.result;
    }

    async function createTemplate(client: ConnectorClient): Promise<ConnectorRelationshipTemplate> {
        const response = await client.relationshipTemplates.createOwnRelationshipTemplate({
            maxNumberOfAllocations: 1,
            expiresAt: DateTime.utc().plus({ minutes: 10 }).toString(),
            content: { a: "b" }
        });

        return response.result;
    }

    async function syncUntilHasRelationships(client: ConnectorClient, expectedNumberOfRelationships = 1): Promise<ConnectorRelationship[]> {
        const syncResult = await syncUntil(client, (syncResult) => syncResult.relationships.length >= expectedNumberOfRelationships);
        return syncResult.relationships;
    }
    async function syncUntil(client: ConnectorClient, until: (syncResult: ConnectorSyncResult) => boolean): Promise<ConnectorSyncResult> {
        const syncResponse = await client.account.sync();

        const connectorSyncResult: ConnectorSyncResult = { messages: [...syncResponse.result.messages], relationships: [...syncResponse.result.relationships] };

        let iterationNumber = 0;
        while (!until(connectorSyncResult) && iterationNumber < 25) {
            // incrementally increase sleep duration
            iterationNumber++;
            await sleep(iterationNumber * 50);

            const newSyncResponse = await client.account.sync();

            const newConnectorSyncResult = newSyncResponse.result;

            connectorSyncResult.messages.push(...newConnectorSyncResult.messages);
            connectorSyncResult.relationships.push(...newConnectorSyncResult.relationships);
        }

        if (!until(connectorSyncResult)) {
            throw new Error("syncUntil() timed out");
        }

        return connectorSyncResult;
    }
}

export async function establishRelationshipNew(client1: ConnectorClientNew, client2: ConnectorClientNew): Promise<void> {
    const template = await exchangeTemplate(client1, client2);

    const createRelationshipResponse = await client2.createRelationship(null, { templateId: template.id, content: { a: "b" } });

    const relationships = await syncUntilHasRelationships(client1);

    const acceptResponse = await client1.acceptRelationshipChange({ changeId: relationships[0].changes[0].id, id: relationships[0].id }, { content: { a: "b" } });

    const relationships2 = await syncUntilHasRelationships(client2);

    async function exchangeTemplate(clientCreator: ConnectorClientNew, clientRecpipient: ConnectorClientNew): Promise<Components.Schemas.RelationshipTemplate> {
        const templateToken = await getTemplateToken(clientCreator);

        const response = await clientRecpipient.loadPeerRelationshipTemplate(null, {
            reference: templateToken.truncatedReference
        });

        return response.data.result;
    }

    async function getTemplateToken(client: ConnectorClientNew): Promise<Components.Schemas.Token> {
        const template = await createTemplate(client);

        const response = await client.createTokenForTemplate({ id: template.id });

        return response.data.result;
    }

    async function createTemplate(client: ConnectorClientNew): Promise<Components.Schemas.RelationshipTemplate> {
        const response = await client.createOwnRelationshipTemplate(null, {
            maxNumberOfAllocations: 1,
            expiresAt: DateTime.utc().plus({ minutes: 10 }).toString(),
            content: { a: "b" }
        });

        return response.data.result;
    }

    async function syncUntilHasRelationships(client: ConnectorClientNew, expectedNumberOfRelationships = 1): Promise<Components.Schemas.Relationship[]> {
        const syncResult = await syncUntil(client, (syncResult) => syncResult.relationships.length >= expectedNumberOfRelationships);
        return syncResult.relationships;
    }
    type SyncResult = Paths.Sync.Responses.$200["result"];
    async function syncUntil(client: ConnectorClientNew, until: (syncResult: SyncResult) => boolean): Promise<SyncResult> {
        const syncResponse = await client.sync();

        const connectorSyncResult: Paths.Sync.Responses.$200["result"] = {
            messages: [...syncResponse.data.result.messages],
            relationships: [...syncResponse.data.result.relationships]
        };

        let iterationNumber = 0;
        while (!until(connectorSyncResult) && iterationNumber < 25) {
            // incrementally increase sleep duration
            iterationNumber++;
            await sleep(iterationNumber * 50);

            const newSyncResponse = await client.sync();

            const newConnectorSyncResult = newSyncResponse.data.result;

            connectorSyncResult.messages.push(...newConnectorSyncResult.messages);
            connectorSyncResult.relationships.push(...newConnectorSyncResult.relationships);
        }

        if (!until(connectorSyncResult)) {
            throw new Error("syncUntil() timed out");
        }

        return connectorSyncResult;
    }
}
