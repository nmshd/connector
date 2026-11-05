import { logs, SeverityNumber } from "@opentelemetry/api";
import { configure, getLogger, shutdown } from "log4js";
import { createOpenTelemetryLogAppender } from "../src/openTelemetry/OpenTelemetryLogAppender";

describe("OpenTelemetryLogAppender", () => {
    afterEach(async () => {
        await new Promise<void>((resolve) => shutdown(() => resolve()));
        logs.disable();
    });

    test("emits logs through the stable OpenTelemetry API", () => {
        const emit = jest.fn();
        const enabled = jest.fn().mockReturnValue(true);
        logs.setGlobalLoggerProvider({ getLogger: () => ({ emit, enabled }) });
        configure({
            appenders: { otel: createOpenTelemetryLogAppender() },
            categories: { default: { appenders: ["otel"], level: "info" } }
        });

        getLogger("test-category").info("test message");

        expect(enabled).toHaveBeenCalledWith({ severityNumber: SeverityNumber.INFO });
        expect(emit).toHaveBeenCalledWith(
            expect.objectContaining({
                body: "test message",
                severityNumber: SeverityNumber.INFO,
                severityText: "INFO",
                attributes: expect.objectContaining({ "log.logger": "test-category" })
            })
        );
    });
});
