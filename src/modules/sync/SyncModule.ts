import correlator from "correlation-id";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

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

    public stop(): void {
        clearTimeout(this.syncTimeout);
    }
}
