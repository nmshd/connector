import { trace, Tracer } from "@opentelemetry/api";
import { version as connectorVersion } from "../../package.json";

const CONNECTOR_TRACER_NAME = "@nmshd/connector";

export function getConnectorTracer(): Tracer {
    return trace.getTracer(CONNECTOR_TRACER_NAME, connectorVersion);
}
