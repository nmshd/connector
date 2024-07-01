import { ILogger } from "@js-soft/logging-abstractions";

export abstract class MessageBrokerConnector<TConfiguration> {
    public constructor(
        protected readonly configuration: TConfiguration,
        protected readonly logger: ILogger
    ) {
        if (!this.configuration) throw new Error("Cannot start the broker, the 'configuration' is not defined.");
    }

    public abstract init(): void | Promise<void>;
    public abstract publish(namespace: string, data: Buffer): void | Promise<void>;
    public abstract close(): void | Promise<void>;
}
