import { RelationshipChangedEvent, RelationshipStatus } from "@nmshd/runtime";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

export interface AutoDecomposeDeletionProposedRelationshipsModuleConfiguration extends ConnectorRuntimeModuleConfiguration {}

export default class AutoDecomposeDeletionProposedRelationshipsModule extends ConnectorRuntimeModule<AutoDecomposeDeletionProposedRelationshipsModuleConfiguration> {
    private currentIdentity: string;

    public init(): void {
        // Nothing to do here
    }

    public async start(): Promise<void> {
        const currentIdentityResult = await this.runtime.getServices().transportServices.account.getIdentityInfo();
        this.currentIdentity = currentIdentityResult.value.address;

        await this.decomposeDeletionProposedRelationshipsAtStartup();

        this.subscribeToEvent(RelationshipChangedEvent, this.handleRelationshipChanged.bind(this));
    }

    private async decomposeDeletionProposedRelationshipsAtStartup() {
        const services = this.runtime.getServices();

        const deletionProposedRelationships = await services.transportServices.relationships.getRelationships({ query: { status: "DeletionProposed" } });
        this.logger.info(`Found ${deletionProposedRelationships.value.length} 'DeletionProposed' Relationships.`);

        for (const relationship of deletionProposedRelationships.value) {
            await this.decomposeRelationship(relationship.id);
        }
    }

    private async handleRelationshipChanged(event: RelationshipChangedEvent) {
        if (event.data.status !== RelationshipStatus.DeletionProposed) return;

        this.logger.info("'DeletionProposed' Relationship detected.");

        await this.decomposeRelationship(event.data.id);
    }

    private async decomposeRelationship(relationshipId: string) {
        const result = await this.runtime.getServices().transportServices.relationships.decomposeRelationship({ relationshipId });

        if (result.isSuccess) {
            this.logger.info("'DeletionProposed' Relationship was decomposed successfully.");
        } else {
            this.logger.error("Error while decomposing 'DeletionProposed' Relationship:", result.error);
        }
    }

    public stop(): void {
        this.unsubscribeFromAllEvents();
    }
}
