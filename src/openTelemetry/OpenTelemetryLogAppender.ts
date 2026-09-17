import { Logger, logs, SeverityNumber } from "@opentelemetry/api-logs";
import correlator from "correlation-id";
import type * as log4js from "log4js";
import { formatWithOptions } from "util";

const LOG_LEVEL_ENVIRONMENT_VARIABLE = "NMSHD_OTEL_LOG_LEVEL";
const DEFAULT_LOG_LEVEL = "INFO";
const SUPPORTED_LOG_LEVELS = ["ALL", "TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "OFF"] as const;

export function createOpenTelemetryLogAppender(): log4js.Appender {
    const minimumLogLevel = readMinimumLogLevel();
    const loggers = new Map<string, Logger>();

    const appenderModule: log4js.AppenderModule = {
        configure: () => (event) => {
            if (!event.level.isGreaterThanOrEqualTo(minimumLogLevel)) return;

            const severityNumber = mapSeverity(event.level.levelStr);
            const logger = getLogger(loggers, event.categoryName);
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

    return { type: appenderModule };
}

function readMinimumLogLevel(): string {
    const configuredLogLevel = process.env[LOG_LEVEL_ENVIRONMENT_VARIABLE]?.trim();
    const minimumLogLevel = (configuredLogLevel === undefined || configuredLogLevel === "" ? DEFAULT_LOG_LEVEL : configuredLogLevel).toUpperCase();

    if (!SUPPORTED_LOG_LEVELS.some((supportedLogLevel) => supportedLogLevel === minimumLogLevel)) {
        throw new Error(`Invalid value '${configuredLogLevel}' for ${LOG_LEVEL_ENVIRONMENT_VARIABLE}. Expected one of: ${SUPPORTED_LOG_LEVELS.join(", ")}.`);
    }

    return minimumLogLevel;
}

function getLogger(loggers: Map<string, Logger>, categoryName: string): Logger {
    let logger = loggers.get(categoryName);
    if (!logger) {
        logger = logs.getLogger(categoryName);
        loggers.set(categoryName, logger);
    }
    return logger;
}

function mapSeverity(level: string): SeverityNumber {
    switch (level.toUpperCase()) {
        case "TRACE":
            return SeverityNumber.TRACE;
        case "DEBUG":
            return SeverityNumber.DEBUG;
        case "INFO":
            return SeverityNumber.INFO;
        case "WARN":
            return SeverityNumber.WARN;
        case "ERROR":
            return SeverityNumber.ERROR;
        case "FATAL":
            return SeverityNumber.FATAL;
        default:
            return SeverityNumber.UNSPECIFIED;
    }
}
