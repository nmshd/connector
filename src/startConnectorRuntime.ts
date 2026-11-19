import { ROOT_CONTEXT, SpanStatusCode } from "@opentelemetry/api";
import { ConnectorRuntime } from "./ConnectorRuntime";
import type { ConnectorRuntimeConfig } from "./ConnectorRuntimeConfig";
import { getConnectorTracer } from "./openTelemetry/tracing";

export async function startConnectorRuntime(connectorConfig: ConnectorRuntimeConfig, shutdownOpenTelemetry?: () => Promise<void>): Promise<ConnectorRuntime> {
    const tracer = getConnectorTracer();

    return await tracer.startActiveSpan("connector.startup", {}, ROOT_CONTEXT, async (span) => {
        let runtime: ConnectorRuntime | undefined;

        try {
            runtime = await ConnectorRuntime.create(connectorConfig, shutdownOpenTelemetry);
            await runtime.start();
            span.setStatus({ code: SpanStatusCode.OK });
            return runtime;
        } catch (error) {
            if (runtime) await runtime.stop();
            if (error instanceof Error) span.recordException(error);
            span.setStatus({ code: SpanStatusCode.ERROR, message: error instanceof Error ? error.message : String(error) });
            throw error;
        } finally {
            span.end();
        }
    });
}
