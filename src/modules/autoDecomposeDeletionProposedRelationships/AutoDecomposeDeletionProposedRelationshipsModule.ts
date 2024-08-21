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

        this.subscribeToEvent(RelationshipChangedEvent, this.handleRelationshipChanged.bind(this));
    }

    private async handleRelationshipChanged(event: RelationshipChangedEvent) {
        if (!this.isIncomingDeletionProposedRelationship(event)) return;

        this.logger.info("Incoming 'DeletionProposed' Relationship detected.");

        const result = await this.runtime.getServices().transportServices.relationships.decomposeRelationship({ relationshipId: event.data.id });

        if (result.isSuccess) {
            this.logger.info("Incoming 'DeletionProposed' Relationship was decomposed successfully.");
        } else {
            this.logger.error("Error while decomposing 'DeletionProposed' Relationship:", result.error);
        }
    }

    private isIncomingDeletionProposedRelationship(event: RelationshipChangedEvent) {
        const data = event.data;
        if (data.status !== RelationshipStatus.DeletionProposed) return false;

        const auditLogEntry = data.auditLog[-1];
        return auditLogEntry.createdBy !== this.currentIdentity;
    }

    public stop(): void {
        this.unsubscribeFromAllEvents();
    }
}
