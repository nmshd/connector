import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "@nmshd/connector-types";
import { RelationshipChangedEvent, RelationshipStatus } from "@nmshd/runtime";

export interface AutoAcceptPendingRelationshipsModuleConfiguration extends ConnectorRuntimeModuleConfiguration {}

export class AutoAcceptPendingRelationshipsModule extends ConnectorRuntimeModule<AutoAcceptPendingRelationshipsModuleConfiguration> {
    public init(): void {
        // Nothing to do here
    }

    public start(): void {
        this.subscribeToEvent(RelationshipChangedEvent, this.handleRelationshipChanged.bind(this));
    }

    private async handleRelationshipChanged(event: RelationshipChangedEvent) {
        if (!this.isIncomingPendingRelationship(event)) return;

        this.logger.info("Incoming 'Pending' Relationship detected.");

        const result = await this.runtime.getServices().transportServices.relationships.acceptRelationship({ relationshipId: event.data.id });

        if (result.isSuccess) {
            this.logger.info("Incoming 'Pending' Relationship was accepted successfully.");
        } else {
            this.logger.error("Error while accepting 'Pending' Relationship:", result.error);
        }
    }

    private isIncomingPendingRelationship(event: RelationshipChangedEvent) {
        const relationship = event.data;
        if (relationship.status !== RelationshipStatus.Pending) return false;
        if (relationship.auditLog.length !== 1) return false;

        return relationship.auditLog[0].createdBy !== event.eventTargetAddress;
    }

    public stop(): void {
        this.unsubscribeFromAllEvents();
    }
}
