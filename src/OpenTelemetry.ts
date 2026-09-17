import type { Span } from "@opentelemetry/api";
import type { Instrumentation } from "@opentelemetry/instrumentation";
import { AmqplibInstrumentation } from "@opentelemetry/instrumentation-amqplib";
import { ExpressInstrumentation, ExpressLayerType } from "@opentelemetry/instrumentation-express";
import { GrpcInstrumentation } from "@opentelemetry/instrumentation-grpc";
import { HostMetricsInstrumentation } from "@opentelemetry/instrumentation-host-metrics";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { MongoDBInstrumentation } from "@opentelemetry/instrumentation-mongodb";
import { RedisInstrumentation } from "@opentelemetry/instrumentation-redis";
import { RuntimeNodeInstrumentation } from "@opentelemetry/instrumentation-runtime-node";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { NodeSDK, resources } from "@opentelemetry/sdk-node";
import type { ClientRequest, IncomingMessage } from "http";
import { version as connectorVersion } from "../package.json";

const DEFAULT_SERVICE_NAME = "enmeshed.connector";
const INSTRUMENTATION_FACTORIES: [string, () => Instrumentation][] = [
    ["amqplib", () => new AmqplibInstrumentation()],
    ["express", () => new ExpressInstrumentation({ ignoreLayersType: [ExpressLayerType.MIDDLEWARE] })],
    ["grpc", () => new GrpcInstrumentation()],
    ["host-metrics", () => new HostMetricsInstrumentation()],
    [
        "http",
        () =>
            new HttpInstrumentation({
                ignoreIncomingRequestHook: (request) => new URL(request.url ?? "", "http://localhost").pathname === "/health",
                requestHook: updateHttpSpanName
            })
    ],
    ["mongodb", () => new MongoDBInstrumentation({ responseHook: setMongoDbPeerService })],
    ["redis", () => new RedisInstrumentation()],
    ["runtime-node", () => new RuntimeNodeInstrumentation()],
    ["undici", () => new UndiciInstrumentation()]
];

export class OpenTelemetry {
    private shutdownPromise?: Promise<void>;

    private constructor(private readonly sdk: NodeSDK) {}

    public static initialize(): OpenTelemetry {
        if (!process.env.OTEL_SERVICE_NAME?.trim()) process.env.OTEL_SERVICE_NAME = DEFAULT_SERVICE_NAME;

        const sdk = new NodeSDK({
            instrumentations: OpenTelemetry.createInstrumentations(),
            resource: resources.defaultResource().merge(
                resources.resourceFromAttributes({
                    "service.version": connectorVersion
                })
            )
        });

        sdk.start();
        return new OpenTelemetry(sdk);
    }

    private static createInstrumentations(): Instrumentation[] {
        const enabledInstrumentations = OpenTelemetry.readInstrumentationNames("OTEL_NODE_ENABLED_INSTRUMENTATIONS");
        const disabledInstrumentations = OpenTelemetry.readInstrumentationNames("OTEL_NODE_DISABLED_INSTRUMENTATIONS");

        return INSTRUMENTATION_FACTORIES.filter(([name]) => (enabledInstrumentations.size === 0 || enabledInstrumentations.has(name)) && !disabledInstrumentations.has(name)).map(
            ([, createInstrumentation]) => createInstrumentation()
        );
    }

    private static readInstrumentationNames(environmentVariable: string): Set<string> {
        return new Set(
            process.env[environmentVariable]
                ?.split(",")
                .map((name) => name.trim())
                .filter(Boolean) ?? []
        );
    }

    public async shutdown(): Promise<void> {
        this.shutdownPromise ??= this.sdk.shutdown().catch((error: unknown) => {
            // eslint-disable-next-line no-console
            console.error("Failed to shut down OpenTelemetry cleanly.", error);
        });

        await this.shutdownPromise;
    }
}

function updateHttpSpanName(span: Span, request: ClientRequest | IncomingMessage): void {
    if ("path" in request) span.setAttribute("peer.service", request.host);

    const requestPath = "path" in request ? request.path : request.url;
    if (!requestPath) return;

    const pathname = new URL(requestPath, "http://localhost").pathname;
    span.updateName(`${request.method ?? "GET"} ${pathname}`);
}

function setMongoDbPeerService(span: Span): void {
    span.setAttribute("peer.service", "mongodb");
}
