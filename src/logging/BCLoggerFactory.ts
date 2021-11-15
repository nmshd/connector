import { ILogger, ILoggerFactory } from "@js-soft/logging-abstractions";

export class BCLoggerFactory {
    private static loggerFactory?: ILoggerFactory;

    public static init(loggerFactory: ILoggerFactory): void {
        BCLoggerFactory.loggerFactory = loggerFactory;
    }

    public static getLogger(category: string | Function): ILogger {
        if (!BCLoggerFactory.loggerFactory) {
            throw new Error(`${BCLoggerFactory.name} not initialized. Call init before calling getLogger.`);
        }

        if (typeof category === "function") {
            category = category.name;
        }

        return BCLoggerFactory.loggerFactory.getLogger(`Connector.${category}`);
    }
}
