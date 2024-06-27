import { ILogger } from "@js-soft/logging-abstractions";
import eventSourceModule from "eventsource";
import { ConnectorMode } from "../../ConnectorMode";
import { ConnectorRuntime } from "../../ConnectorRuntime";
import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "../../ConnectorRuntimeModule";

export enum BackboneEventName {
    DatawalletModificationsCreated = "DatawalletModificationsCreated",
    ExternalEventCreated = "ExternalEventCreated"
}

export interface IBackboneEventContent {
    eventName: BackboneEventName;
    sentAt: string;
    payload: any;
}

export default class SseModule extends ConnectorRuntimeModule {
    private eventSource: eventSourceModule | undefined;

    public constructor(runtime: ConnectorRuntime, configuration: ConnectorRuntimeModuleConfiguration, logger: ILogger, connectorMode: ConnectorMode) {
        super(runtime, configuration, logger, connectorMode);
    }

    public init(): void | Promise<void> {
        // Nothing to do here
    }

    public async start(): Promise<void> {
        await this.runSync();

        await this.recreateEventSource();
    }

    private async recreateEventSource(): Promise<void> {
        if (this.eventSource) {
            try {
                this.eventSource.close();
            } catch (error) {
                this.logger.error("Failed to close event source", error);
            }
        }

        const baseUrlOverride = this.connectorMode === "debug" && process.env.SSE_BASEURL_OVERRIDE ? process.env.SSE_BASEURL_OVERRIDE : null;
        const baseUrl = baseUrlOverride ?? this.runtime["runtimeConfig"].transportLibrary.baseUrl;
        const sseUrl = `${baseUrl}/api/v1/sse`;

        this.logger.info(`Connecting to SSE endpoint: ${sseUrl}`);

        const token = await this.runtime.getBackboneAuthenticationToken();

        const eventSource = new eventSourceModule(sseUrl, {
            https: { rejectUnauthorized: true },
            proxy: process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY,
            headers: { authorization: `Bearer ${token}` }
        });
        this.eventSource = eventSource;

        eventSource.addEventListener("ExternalEventCreated", async () => await this.runSync());

        await new Promise<void>((resolve, reject) => {
            eventSource.onopen = () => {
                this.logger.info("Connected to SSE endpoint");
                resolve();

                eventSource.onopen = () => {
                    // noop
                };
            };

            eventSource.onerror = (error) => {
                reject(error);
            };
        });

        eventSource.onerror = async (error) => {
            if (error.status === 401) await this.recreateEventSource();
        };
    }

    private async runSync(): Promise<void> {
        const services = this.runtime.getServices();

        const syncResult = await services.transportServices.account.syncEverything();
        if (syncResult.isError) {
            this.logger.error(syncResult);
            return;
        }
    }

    public stop(): void {
        this.eventSource?.close();
    }
}
