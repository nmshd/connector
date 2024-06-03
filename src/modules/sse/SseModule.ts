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
        // TODO: run a sync after every other module is started

        const baseUrl = this.connectorMode === "debug" && process.env.USE_LOCAL_SSE ? "http://host.docker.internal:3333" : this.runtime["runtimeConfig"].transportLibrary.baseUrl;
        const sseUrl = `${baseUrl}/sse`;

        this.logger.info(`Connecting to SSE endpoint: ${sseUrl}`);

        const token = await this.runtime.getBackboneAuthenticationToken();

        this.eventSource = new eventSourceModule(sseUrl, {
            https: { rejectUnauthorized: true },
            proxy: process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY,
            headers: { authorization: `Bearer ${token}` }
        });

        await new Promise<void>((resolve, reject) => {
            this.eventSource.onopen = () => {
                this.logger.info("Connected to SSE endpoint");
                resolve();
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

        this.eventSource.addEventListener("message", async ({ data }) => {
            if (typeof data !== "string") {
                return;
            }

            const content = JSON.parse(data) as IBackboneEventContent;
            await this.handleEvent(content).catch((error) => {
                this.logger.error(error);
            });
        });
    }

    private async handleEvent(content: IBackboneEventContent): Promise<void> {
        const services = this.runtime.getServices();

        if (content.eventName !== "ExternalEventCreated") {
            this.logger.debug(`Received event '${content.eventName}' that will be ignored.`);
            return;
        }

        const syncResult = await services.transportServices.account.syncEverything();
        if (syncResult.isError) {
            this.logger.error(syncResult);
            return;
        }
    }

    public stop(): void {
        this.eventSource.close();
    }
}
