import { ConnectorRuntimeConfig } from "../src/ConnectorRuntimeConfig";
import { OpenTelemetry } from "../src/OpenTelemetry";

describe("OpenTelemetry", () => {
    describe("initialize", () => {
        const originalEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
        const originalServiceName = process.env.OTEL_SERVICE_NAME;

        afterEach(() => {
            restoreEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT", originalEndpoint);
            restoreEnvironmentVariable("OTEL_SERVICE_NAME", originalServiceName);
        });

        test("does not initialize OpenTelemetry if no endpoint is configured", async () => {
            delete process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
            delete process.env.OTEL_SERVICE_NAME;

            const openTelemetry = await OpenTelemetry.initialize({} as ConnectorRuntimeConfig);

            expect(openTelemetry).toBeUndefined();
            expect(process.env.OTEL_EXPORTER_OTLP_ENDPOINT).toBeUndefined();
            expect(process.env.OTEL_SERVICE_NAME).toBeUndefined();
        });
    });
});

function restoreEnvironmentVariable(name: string, value: string | undefined): void {
    if (value === undefined) {
        delete process.env[name];
        return;
    }

    process.env[name] = value;
}
