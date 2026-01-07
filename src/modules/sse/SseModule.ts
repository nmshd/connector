import { ConnectorRuntimeModule, ConnectorRuntimeModuleConfiguration } from "@nmshd/connector-types";
import correlator from "correlation-id";
import { EventSource } from "eventsource";
import { Agent, fetch, ProxyAgent } from "undici";

export interface SseModuleConfiguration extends ConnectorRuntimeModuleConfiguration {
    baseUrlOverride?: string;
}

export class SseModule extends ConnectorRuntimeModule<SseModuleConfiguration> {
    private eventSource: EventSource | undefined;
    private connectionCheckingTimer: NodeJS.Timeout | undefined;
    static readonly #reconnectIntervalSeconds = 3;

    public init(): void | Promise<void> {
        if (this.configuration.baseUrlOverride && this.connectorMode !== "debug") {
            throw new Error("baseUrlOverride is only allowed in debug mode");
        }
    }

    public async start(): Promise<void> {
        await this.runSync();

        await this.recreateEventSource();

        this.connectionCheckingTimer = setInterval(async () => {
            if (this.eventSource?.readyState !== EventSource.CLOSED) return;

            this.logger.error("The event source has closed without reconnecting on its own");

            await this.runSync();

            await this.recreateEventSource().catch((error) => {
                this.logger.error(`Failed to recreate event source, trying again in ${SseModule.#reconnectIntervalSeconds} seconds`, JSON.stringify(error));
            });
        }, SseModule.#reconnectIntervalSeconds * 1000);
    }

    private async recreateEventSource(): Promise<void> {
        if (this.eventSource) {
            try {
                this.eventSource.close();
            } catch (error) {
                this.logger.error("Failed to close event source", JSON.stringify(error));
            }
        }

        const baseUrl = this.configuration.baseUrlOverride ?? this.runtime["runtimeConfig"].transportLibrary.baseUrl;
        const sseUrl = `${baseUrl}/api/v1/sse`;

        const baseOptions: Agent.Options = { connect: { rejectUnauthorized: false } };
        const proxy = baseUrl.startsWith("https://") ? (process.env.https_proxy ?? process.env.HTTPS_PROXY) : (process.env.http_proxy ?? process.env.HTTP_PROXY);

        const eventSource = new EventSource(sseUrl, {
            fetch: async (url, options) => {
                const token = await this.runtime.getBackboneAuthenticationToken();

                this.logger.info(`Trying to connect to the SSE endpoint ${sseUrl}`);
                const response = await fetch(url, {
                    ...options,
                    dispatcher: proxy ? new ProxyAgent({ ...baseOptions, uri: proxy }) : new Agent(baseOptions),
                    headers: { ...options.headers, authorization: `Bearer ${token}` }
                });

                this.logger.info(`Connected to the SSE endpoint ${sseUrl}`);

                return response;
            }
        });

        this.eventSource = eventSource;

        eventSource.addEventListener("ExternalEventCreated", async () => await this.runSync());

        await new Promise<void>((resolve, reject) => {
            eventSource.onopen = () => resolve();
            eventSource.onerror = (error) => reject(error);
        });

        eventSource.onopen = async () => await this.runSync();
        eventSource.onerror = (error) => {
            if (error.message?.includes("terminated")) {
                this.logger.error(`The connection to the SSE server was terminated: '${error.message}'`);
                return;
            }

            if (error.message?.includes("fetch failed")) {
                this.logger.error(`An error occurred while connecting to the SSE server: '${error.message}'`);
                return;
            }

            this.logger.error(`An error occurred: '${error.message}'`);
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

    public override stop(): void {
        this.eventSource?.close();

        if (this.connectionCheckingTimer) {
            clearInterval(this.connectionCheckingTimer);
            this.connectionCheckingTimer = undefined;
        }
    }
}
