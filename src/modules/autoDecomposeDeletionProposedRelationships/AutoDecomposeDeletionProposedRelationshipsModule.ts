import { sleep } from "@js-soft/ts-utils";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "@nmshd/connector-types";
import { RelationshipChangedEvent, RelationshipStatus } from "@nmshd/runtime";

export interface AutoDecomposeDeletionProposedRelationshipsModuleConfiguration extends ConnectorRuntimeModuleConfiguration {}

export class AutoDecomposeDeletionProposedRelationshipsModule extends ConnectorRuntimeModule<AutoDecomposeDeletionProposedRelationshipsModuleConfiguration> {
    public override get displayName(): string {
        return this.configuration.displayName ?? "Auto Decompose DeletionProposed Relationships Module";
    }

    public init(): void {
        // Nothing to do here
    }

    public async start(): Promise<void> {
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

        // wait for 500ms to ensure that no race conditions occur with other external events from the same sync run that triggered this event
        await sleep(500);

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
}
