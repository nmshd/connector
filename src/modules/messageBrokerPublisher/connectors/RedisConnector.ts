import * as redis from "redis";
import { MessageBrokerConnector } from "./MessageBrokerConnector";

export interface RedisConnectorConfiguration {
    url: string;
    database?: string;
}

export class RedisConnector extends MessageBrokerConnector<RedisConnectorConfiguration> {
    private publisher: redis.RedisClientType;

    public async init(): Promise<void> {
        this.publisher = redis.createClient({ url: this.configuration.url });

        await this.publisher.connect().catch((e) => {
            throw new Error(`Could not connect to Redis: (${e.message})`);
        });
    }

    public async publish(namespace: string, data: Buffer): Promise<void> {
        await this.publisher.publish(namespace, data.toString());
    }

    public async close(): Promise<void> {
        await this.publisher.quit().catch((e) => this.logger.error("Could not close the Redis connection", e));
    }
}
