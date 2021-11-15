import { RelationshipChangedEvent } from "@nmshd/runtime";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

export interface AutoAcceptRelationshipCreationChangesModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    responseContent: any;
}

export default class AutoAcceptRelationshipCreationChangesModule extends ConnectorRuntimeModule<AutoAcceptRelationshipCreationChangesModuleConfiguration> {
    private subscriptionId: number;
    private currentIdentity: string;

    public init(): void {
        // Nothing to do here
    }

    public async start(): Promise<void> {
        const currentIdentityResult = await this.runtime.transportServices.account.getIdentityInfo();
        this.currentIdentity = currentIdentityResult.value.address;

        this.subscriptionId = this.runtime.eventBus.subscribe<RelationshipChangedEvent>(RelationshipChangedEvent, async (event) => {
            if (!this.isIncomingRelationshipCreationChange(event)) {
                return;
            }
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
        });
    }

    private isIncomingRelationshipCreationChange(event: RelationshipChangedEvent) {
        return event.data.changes.length === 1 && event.data.changes[0].request.createdBy !== this.currentIdentity;
    }

    public stop(): void {
        this.runtime.eventBus.unsubscribe(RelationshipChangedEvent, this.subscriptionId);
    }
}
