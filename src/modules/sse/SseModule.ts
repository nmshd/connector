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
    private eventSource: eventSourceModule;

    public constructor(runtime: ConnectorRuntime, configuration: ConnectorRuntimeModuleConfiguration, logger: ILogger, connectorMode: ConnectorMode) {
        super(runtime, configuration, logger, connectorMode);
    }

    public init(): void | Promise<void> {
        // Nothing to do here
    }

    public async start(): Promise<void> {
        const services = this.runtime.getServices();

        const syncResult = await services.transportServices.account.syncEverything();
        if (syncResult.isError) {
            this.logger.error(syncResult);
            return;
        }

        const baseUrl =
            // TODO: remove this when the backbone supports sse
            // this.connectorMode === "debug" && process.env.USE_LOCAL_SSE
            //     ? "http://host.docker.internal:3333"
            //     : // this should stay
            this.runtime["runtimeConfig"].transportLibrary.baseUrl;
        const sseUrl = `${baseUrl}/api/v1/sse`;

        this.logger.info(`Connecting to SSE endpoint: ${sseUrl}`);

        const token = await this.runtime.getBackboneAuthenticationToken();

        this.eventSource = new eventSourceModule(sseUrl, {
            https: { rejectUnauthorized: true },
            proxy: process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY,
            headers: { authorization: `Bearer ${token}` }
        });

        this.eventSource.addEventListener("ExternalEventCreated", async () => {
            const syncResult = await services.transportServices.account.syncEverything();
            if (syncResult.isError) {
                this.logger.error(syncResult);
                return;
            }
        });

        await new Promise<void>((resolve, reject) => {
            this.eventSource.onopen = () => {
                this.logger.info("Connected to SSE endpoint");
                resolve();

                this.eventSource.onopen = () => {
                    // noop
                };
            };

            this.eventSource.onerror = (error) => {
                reject(error);
            };
        });

        this.eventSource.onerror = async (error) => {
            if (error.status === 401) {
                // TODO: use a better method to re-authenticate
                // TODO: also run a sync here

                this.stop();
                await this.start();
                return;
            }
        };
    }

    public stop(): void {
        this.eventSource.close();
    }
}
