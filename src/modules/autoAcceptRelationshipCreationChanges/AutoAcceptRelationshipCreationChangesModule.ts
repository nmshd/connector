import { RelationshipChangedEvent, RelationshipChangeStatus } from "@nmshd/runtime";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

export interface AutoAcceptRelationshipCreationChangesModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    responseContent: any;
}

export default class AutoAcceptRelationshipCreationChangesModule extends ConnectorRuntimeModule<AutoAcceptRelationshipCreationChangesModuleConfiguration> {
    private currentIdentity: string;

    public init(): void {
        // Nothing to do here
    }

    public async start(): Promise<void> {
        const currentIdentityResult = await this.runtime.transportServices.account.getIdentityInfo();
        this.currentIdentity = currentIdentityResult.value.address;

        this.subscribeToEvent(RelationshipChangedEvent, this.handleRelationshipChanged.bind(this));
    }

    private async handleRelationshipChanged(event: RelationshipChangedEvent) {
        if (!this.isIncomingPendingRelationshipCreationChange(event)) return;

        this.logger.info("Incoming relationship creation change detected.");

        const result = await this.runtime.transportServices.relationships.acceptRelationshipChange({
            changeId: event.data.changes[0].id,
            content: this.configuration.responseContent || {},
            relationshipId: event.data.id
        });

        if (result.isSuccess) {
            this.logger.info("Incoming relationship creation change was accepted successfully.");
        } else {
            this.logger.error("Error while accepting relationship creation change:", result.error);
        }
    }

    private isIncomingPendingRelationshipCreationChange(event: RelationshipChangedEvent) {
        const data = event.data;
        if (data.changes.length !== 1) return false;

        const creationChange = event.data.changes[0];
        return creationChange.request.createdBy !== this.currentIdentity && creationChange.status === RelationshipChangeStatus.Pending;
    }

    public stop(): void {
        this.unsubscribeFromAllEvents();
    }
}
