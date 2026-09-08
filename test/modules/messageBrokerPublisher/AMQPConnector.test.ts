import { ILogger } from "@js-soft/logging-abstractions";
import amqp from "amqplib";
import { setTimeout as sleep } from "timers/promises";
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { AMQPConnector } from "../../../src/modules/messageBrokerPublisher/connectors";
import getPort from "../../lib/getPort";

const RABBITMQ_IMAGE = "rabbitmq:4.3.4-alpine";
const RABBITMQ_PORT = 5672;
const RABBITMQ_USERNAME = "connector";
const RABBITMQ_PASSWORD = "connector";

interface RabbitMqTopology {
    connection: amqp.ChannelModel;
    channel: amqp.Channel;
    queueName: string;
}

const logger: ILogger = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn()
};

describe("AMQPConnector", () => {
    let rabbitMqContainer: StartedTestContainer | undefined;
    let rabbitMqUrl: string;

    beforeAll(async () => {
        const rabbitMqHostPort = await getPort();

        rabbitMqContainer = await new GenericContainer(RABBITMQ_IMAGE)
            .withEnvironment({
                ["RABBITMQ_DEFAULT_USER"]: RABBITMQ_USERNAME,
                ["RABBITMQ_DEFAULT_PASS"]: RABBITMQ_PASSWORD
            })
            .withExposedPorts({ container: RABBITMQ_PORT, host: rabbitMqHostPort })
            .withWaitStrategy(Wait.forLogMessage(/Server startup complete/))
            .withStartupTimeout(120_000)
            .start();

        rabbitMqUrl = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${rabbitMqContainer.getHost()}:${rabbitMqHostPort}`;
    }, 120_000);

    afterAll(async () => {
        await rabbitMqContainer?.stop().catch((error) => logger.error("Could not stop the RabbitMQ test container.", error));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("publishes events to a real RabbitMQ exchange", async () => {
        const exchange = uniqueExchangeName();
        let connector: AMQPConnector | undefined;
        let topology: RabbitMqTopology | undefined;

        try {
            topology = await createTopology(rabbitMqUrl, exchange);
            connector = new AMQPConnector({ url: rabbitMqUrl, exchange }, logger);

            await connector.init();
            await connector.publish("events.test", Buffer.from(JSON.stringify({ id: 1 })));

            const message = await waitForMessage(topology.channel, topology.queueName);
            expect(message.fields.routingKey).toBe("events.test");
            expect(JSON.parse(message.content.toString())).toStrictEqual({ id: 1 });
        } finally {
            await connector?.close();
            await closeTopology(topology);
        }
    });

    test("re-establishes the connection after RabbitMQ restarts", async () => {
        const exchange = uniqueExchangeName();
        let connector: AMQPConnector | undefined;
        let topology: RabbitMqTopology | undefined;

        try {
            topology = await createTopology(rabbitMqUrl, exchange);
            connector = new AMQPConnector({ url: rabbitMqUrl, exchange }, logger);

            await connector.init();
            await connector.publish("events.beforeRestart", Buffer.from(JSON.stringify({ id: "before" })));
            await waitForMessage(topology.channel, topology.queueName);
            await closeTopology(topology);

            await rabbitMqContainer!.restart({ timeout: 10_000 });

            topology = await createTopology(rabbitMqUrl, exchange);
            const message = await publishUntilReceived(connector, topology, "events.afterRestart", Buffer.from(JSON.stringify({ id: "after" })));

            expect(message.fields.routingKey).toBe("events.afterRestart");
            expect(JSON.parse(message.content.toString())).toStrictEqual({ id: "after" });
        } finally {
            await connector?.close();
            await closeTopology(topology);
        }
    }, 120_000);
});

async function createTopology(rabbitMqUrl: string, exchange: string): Promise<RabbitMqTopology> {
    const connection = await connectToRabbitMq(rabbitMqUrl);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "topic", { durable: true });
    const queue = await channel.assertQueue("", { autoDelete: true, exclusive: true });
    await channel.bindQueue(queue.queue, exchange, "#");

    return { connection, channel, queueName: queue.queue };
}

async function connectToRabbitMq(rabbitMqUrl: string, timeoutMs = 10_000): Promise<amqp.ChannelModel> {
    const deadline = Date.now() + timeoutMs;
    let lastError: unknown;

    while (Date.now() < deadline) {
        try {
            return await amqp.connect(rabbitMqUrl);
        } catch (error) {
            lastError = error;
            await sleep(250);
        }
    }

    throw new Error(`Could not connect to RabbitMQ test container. Last error: ${formatError(lastError)}`);
}

async function closeTopology(topology: RabbitMqTopology | undefined): Promise<void> {
    await topology?.channel.close().catch(() => undefined);
    await topology?.connection.close().catch(() => undefined);
}

async function waitForMessage(channel: amqp.Channel, queueName: string, timeoutMs = 5000): Promise<amqp.GetMessage> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        const message = await channel.get(queueName, { noAck: true });
        if (message) return message;

        await sleep(100);
    }

    throw new Error(`Timed out waiting for a message on queue '${queueName}'.`);
}

async function publishUntilReceived(connector: AMQPConnector, topology: RabbitMqTopology, namespace: string, data: Buffer, timeoutMs = 30_000): Promise<amqp.GetMessage> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        await connector.publish(namespace, data);

        const message = await tryGetMessage(topology.channel, topology.queueName);
        if (message) return message;

        await sleep(500);
    }

    throw new Error(`Timed out waiting for RabbitMQ to receive event '${namespace}'.`);
}

async function tryGetMessage(channel: amqp.Channel, queueName: string): Promise<amqp.GetMessage | undefined> {
    const message = await channel.get(queueName, { noAck: true });
    return message || undefined;
}

function uniqueExchangeName(): string {
    return `connector.test.${Date.now()}.${Math.random().toString(16).slice(2)}`;
}

function formatError(error: unknown): string {
    if (hasAggregateErrors(error)) {
        return error.errors.map((e) => formatError(e)).join("; ");
    }

    if (error instanceof Error) {
        const errorWithDetails = error as Error & { address?: string; code?: string; port?: number };
        const details = [errorWithDetails.code, errorWithDetails.address, errorWithDetails.port].filter((value) => value !== undefined).join(" ");
        return details ? `${error.name}: ${error.message} (${details})` : `${error.name}: ${error.message}`;
    }

    return String(error);
}

function hasAggregateErrors(error: unknown): error is { errors: unknown[] } {
    return typeof error === "object" && error !== null && "errors" in error && Array.isArray((error as { errors?: unknown[] }).errors);
}
