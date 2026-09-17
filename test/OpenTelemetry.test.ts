import { OpenTelemetry } from "../src/OpenTelemetry";

describe("OpenTelemetry", () => {
    const originalSdkDisabled = process.env.OTEL_SDK_DISABLED;
    const originalServiceName = process.env.OTEL_SERVICE_NAME;

    beforeEach(() => {
        process.env.OTEL_SDK_DISABLED = "true";
    });

    afterEach(() => {
        restoreEnvironmentVariable("OTEL_SDK_DISABLED", originalSdkDisabled);
        restoreEnvironmentVariable("OTEL_SERVICE_NAME", originalServiceName);
    });

    test("uses the default service name when none is configured", async () => {
        delete process.env.OTEL_SERVICE_NAME;

        const openTelemetry = OpenTelemetry.initialize();

        expect(process.env.OTEL_SERVICE_NAME).toBe("enmeshed.connector");
        await openTelemetry.shutdown();
    });

    test("preserves a service name configured through the environment", async () => {
        process.env.OTEL_SERVICE_NAME = "custom-service";

        const openTelemetry = OpenTelemetry.initialize();

        expect(process.env.OTEL_SERVICE_NAME).toBe("custom-service");
        await openTelemetry.shutdown();
    });
});

function restoreEnvironmentVariable(name: string, value: string | undefined): void {
    if (value === undefined) {
        delete process.env[name];
        return;
    }

    process.env[name] = value;
}
