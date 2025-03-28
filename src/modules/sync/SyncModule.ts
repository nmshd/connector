import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "@nmshd/connector-types";
import correlator from "correlation-id";

export interface SyncModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    interval: number;
}

export class SyncModule extends ConnectorRuntimeModule<SyncModuleConfiguration> {
    private syncTimeout: NodeJS.Timeout;

    public init(): void {
        // Nothing to do here
    }

    public async start(): Promise<void> {
        await this.sync();
    }

    private async sync() {
        await correlator.withId(async () => {
            const result = await this.runtime.getServices().transportServices.account.syncEverything();
            if (result.isError) this.logger.error("Sync failed", result.error);
        });

        this.syncTimeout = setTimeout(async () => await this.sync(), this.configuration.interval * 1000);
    }

    public override stop(): void {
        clearTimeout(this.syncTimeout);
    }
}
