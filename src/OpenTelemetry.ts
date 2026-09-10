import type { Span } from "@opentelemetry/api";
import type { Logger, SeverityNumber as OpenTelemetrySeverityNumber } from "@opentelemetry/api-logs";
import correlator from "correlation-id";
import type { ClientRequest, IncomingMessage } from "http";
import type * as log4js from "log4js";
import { formatWithOptions } from "util";
import { version as connectorVersion } from "../package.json";
import type { ConnectorRuntimeConfig } from "./ConnectorRuntimeConfig";

type OpenTelemetrySdk = import("@opentelemetry/sdk-node").NodeSDK;
type OpenTelemetryApi = typeof import("@opentelemetry/api");
type OpenTelemetryLogsApi = typeof import("@opentelemetry/api-logs").logs;
type SeverityNumberType = typeof import("@opentelemetry/api-logs").SeverityNumber;

const OPEN_TELEMETRY_APPENDER_NAME = "openTelemetry";
const SERVICE_NAME = "enmeshed-connector";

export class OpenTelemetry {
    private shutdownPromise?: Promise<void>;

    private constructor(
        private readonly sdk: OpenTelemetrySdk,
        private readonly api: OpenTelemetryApi,
        private readonly logs: OpenTelemetryLogsApi,
        private readonly severityNumbers: SeverityNumberType
    ) {}

    public static async initialize(connectorConfig: ConnectorRuntimeConfig): Promise<OpenTelemetry | undefined> {
        const endpoint = connectorConfig.openTelemetry?.endpoint;

        if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim()) process.env.OTEL_EXPORTER_OTLP_ENDPOINT = endpoint;
        if (!process.env.OTEL_SERVICE_NAME?.trim()) process.env.OTEL_SERVICE_NAME = SERVICE_NAME;

        if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return;

        const [nodeSdkModule, apiModule, autoInstrumentationModule, expressInstrumentationModule, logsModule] = await Promise.all([
            import("@opentelemetry/sdk-node"),
            import("@opentelemetry/api"),
            import("@opentelemetry/auto-instrumentations-node"),
            import("@opentelemetry/instrumentation-express"),
            import("@opentelemetry/api-logs")
        ]);

        const instrumentationConfiguration: NonNullable<Parameters<typeof autoInstrumentationModule.getNodeAutoInstrumentations>[0]> = {};
        instrumentationConfiguration["@opentelemetry/instrumentation-dns"] = { enabled: false };
        instrumentationConfiguration["@opentelemetry/instrumentation-express"] = {
            ignoreLayersType: [expressInstrumentationModule.ExpressLayerType.MIDDLEWARE]
        };
        instrumentationConfiguration["@opentelemetry/instrumentation-host-metrics"] = { enabled: OpenTelemetry.shouldEnableHostMetricsByDefault() };
        instrumentationConfiguration["@opentelemetry/instrumentation-http"] = {
            ignoreIncomingRequestHook: (request) => new URL(request.url ?? "", "http://localhost").pathname === "/health",
            requestHook: OpenTelemetry.updateHttpSpanName
        };
        instrumentationConfiguration["@opentelemetry/instrumentation-mongodb"] = {
            responseHook: OpenTelemetry.setMongoDbPeerService
        };
        instrumentationConfiguration["@opentelemetry/instrumentation-net"] = { enabled: false };
        instrumentationConfiguration["@opentelemetry/instrumentation-router"] = { enabled: false };

        const sdk = new nodeSdkModule.NodeSDK({
            instrumentations: [autoInstrumentationModule.getNodeAutoInstrumentations(instrumentationConfiguration)],
            resource: nodeSdkModule.resources.defaultResource().merge(
                nodeSdkModule.resources.resourceFromAttributes({
                    "service.version": connectorVersion
                })
            )
        });

        sdk.start();
        return new OpenTelemetry(sdk, apiModule, logsModule.logs, logsModule.SeverityNumber);
    }

    private static shouldEnableHostMetricsByDefault(): boolean {
        const enabledInstrumentations = process.env.OTEL_NODE_ENABLED_INSTRUMENTATIONS;
        if (enabledInstrumentations?.trim()) return false;

        const disabledInstrumentations = process.env.OTEL_NODE_DISABLED_INSTRUMENTATIONS?.split(",").map((instrumentation) => instrumentation.trim());
        return !disabledInstrumentations?.includes("host-metrics");
    }

    private static updateHttpSpanName(span: Span, request: ClientRequest | IncomingMessage): void {
        if ("path" in request) span.setAttribute("peer.service", request.host);

        const requestPath = "path" in request ? request.path : request.url;
        if (!requestPath) return;

        const pathname = new URL(requestPath, "http://localhost").pathname;
        span.updateName(`${request.method ?? "GET"} ${pathname}`);
    }

    private static setMongoDbPeerService(span: Span): void {
        span.setAttribute("peer.service", "mongodb");
    }

    public async traceStartup<T>(start: () => Promise<T>): Promise<T> {
        const tracer = this.api.trace.getTracer(SERVICE_NAME);

        return await tracer.startActiveSpan("connector.startup", {}, this.api.ROOT_CONTEXT, async (span) => {
            try {
                const result = await start();
                span.setStatus({ code: this.api.SpanStatusCode.OK });
                return result;
            } catch (error) {
                if (error instanceof Error) span.recordException(error);
                span.setStatus({ code: this.api.SpanStatusCode.ERROR, message: error instanceof Error ? error.message : String(error) });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public addLogAppender(configuration: log4js.Configuration): log4js.Configuration {
        const extendedConfiguration: log4js.Configuration = {
            ...configuration,
            appenders: { ...configuration.appenders },
            categories: Object.fromEntries(Object.entries(configuration.categories).map(([name, category]) => [name, { ...category, appenders: [...category.appenders] }]))
        };

        const appenderName = OpenTelemetry.getAvailableAppenderName(extendedConfiguration);
        const loggers = new Map<string, Logger>();

        const appenderModule: log4js.AppenderModule = {
            configure: () => (event) => {
                const severityNumber = OpenTelemetry.mapSeverity(event.level.levelStr, this.severityNumbers);
                const logger = OpenTelemetry.getLogger(loggers, this.logs, event.categoryName);
                if (!logger.enabled({ severityNumber })) return;

                const attributes: Record<string, string | number> = {
                    "log.logger": event.categoryName,
                    "process.pid": event.pid
                };
                const correlationId = correlator.getId();
                if (correlationId) attributes["correlation.id"] = correlationId;
                if (event.fileName) attributes["code.file.path"] = event.fileName;
                if (event.functionName) attributes["code.function.name"] = event.functionName;
                if (event.lineNumber) attributes["code.line.number"] = event.lineNumber;

                logger.emit({
                    timestamp: event.startTime,
                    severityNumber,
                    severityText: event.level.levelStr,
                    body: formatWithOptions({ depth: null }, ...event.data),
                    attributes,
                    exception: event.error
                });
            }
        };

        extendedConfiguration.appenders[appenderName] = { type: appenderModule };
        for (const category of Object.values(extendedConfiguration.categories)) {
            if (!category.appenders.includes(appenderName)) category.appenders.push(appenderName);
        }

        return extendedConfiguration;
    }

    private static getAvailableAppenderName(configuration: log4js.Configuration): string {
        let appenderName = OPEN_TELEMETRY_APPENDER_NAME;
        while (Object.hasOwn(configuration.appenders, appenderName)) appenderName = `_${appenderName}`;
        return appenderName;
    }

    private static getLogger(loggers: Map<string, Logger>, logs: OpenTelemetryLogsApi, categoryName: string): Logger {
        let logger = loggers.get(categoryName);
        if (!logger) {
            logger = logs.getLogger(categoryName);
            loggers.set(categoryName, logger);
        }
        return logger;
    }

    private static mapSeverity(level: string, severityNumbers: SeverityNumberType): OpenTelemetrySeverityNumber {
        switch (level.toUpperCase()) {
            case "TRACE":
                return severityNumbers.TRACE;
            case "DEBUG":
                return severityNumbers.DEBUG;
            case "INFO":
                return severityNumbers.INFO;
            case "WARN":
                return severityNumbers.WARN;
            case "ERROR":
                return severityNumbers.ERROR;
            case "FATAL":
                return severityNumbers.FATAL;
            default:
                return severityNumbers.UNSPECIFIED;
        }
    }

    public async shutdown(): Promise<void> {
        this.shutdownPromise ??= this.sdk.shutdown().catch((error: unknown) => {
            // eslint-disable-next-line no-console
            console.error("Failed to shut down OpenTelemetry cleanly.", error);
        });

        await this.shutdownPromise;
    }
}
