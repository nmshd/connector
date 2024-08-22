import { RelationshipChangedEvent, RelationshipStatus } from "@nmshd/runtime";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

export interface AutoAcceptPendingRelationshipsModuleConfiguration extends ConnectorRuntimeModuleConfiguration {}

export default class AutoAcceptPendingRelationshipsModule extends ConnectorRuntimeModule<AutoAcceptPendingRelationshipsModuleConfiguration> {
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
        const data = event.data;
        if (data.status !== RelationshipStatus.Pending) return false;
        if (data.auditLog.length !== 1) return false;

        const auditLogEntry = data.auditLog[0];
        return auditLogEntry.createdBy !== this.currentIdentity;
    }

    public stop(): void {
        this.unsubscribeFromAllEvents();
    }
}
