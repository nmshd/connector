import { ILogger } from "@js-soft/logging-abstractions";
import correlator from "correlation-id";
import { EventSource } from "eventsource";
import { Agent, fetch, ProxyAgent } from "undici";
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

export interface SseModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    baseUrlOverride?: string;
}

export default class SseModule extends ConnectorRuntimeModule<SseModuleConfiguration> {
    private eventSource: EventSource | undefined;

    public constructor(runtime: ConnectorRuntime, configuration: ConnectorRuntimeModuleConfiguration, logger: ILogger, connectorMode: ConnectorMode) {
        super(runtime, configuration, logger, connectorMode);
    }

    public init(): void | Promise<void> {
        if (this.configuration.baseUrlOverride && this.connectorMode !== "debug") {
            throw new Error("baseUrlOverride is only allowed in debug mode");
        }
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

        const baseUrl = this.configuration.baseUrlOverride ?? this.runtime["runtimeConfig"].transportLibrary.baseUrl;
        const sseUrl = `${baseUrl}/api/v1/sse`;

        this.logger.info(`Connecting to SSE endpoint: ${sseUrl}`);

        const proxy = process.env.https_proxy ?? process.env.HTTPS_PROXY ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
        const dispatcher = proxy ? new ProxyAgent({ uri: proxy, connect: { rejectUnauthorized: false } }) : new Agent({ connect: { rejectUnauthorized: false } });

        const token = await this.runtime.getBackboneAuthenticationToken();
        const eventSource = new EventSource(sseUrl, {
            fetch: async (url, options) => await fetch(url, { ...options, dispatcher, headers: { ...options?.headers, authorization: `Bearer ${token}` } })
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
        this.logger.info("Running sync");

        const services = this.runtime.getServices();

        await correlator.withId(async () => {
            const syncResult = await services.transportServices.account.syncEverything();
            if (syncResult.isError) {
                this.logger.error(syncResult);
            }
        });
    }

    public stop(): void {
        this.eventSource?.close();
    }
}
