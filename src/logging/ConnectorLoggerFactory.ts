import { ILogger, ILoggerFactory } from "@js-soft/logging-abstractions";

export class ConnectorLoggerFactory {
    private static loggerFactory?: ILoggerFactory;

    public static init(loggerFactory: ILoggerFactory): void {
        ConnectorLoggerFactory.loggerFactory = loggerFactory;
    }

    public static getLogger(category: string | Function): ILogger {
        if (!ConnectorLoggerFactory.loggerFactory) {
            throw new Error(`${ConnectorLoggerFactory.name} not initialized. Call init before calling getLogger.`);
        }

        if (typeof category === "function") {
            category = category.name;
        }

        return ConnectorLoggerFactory.loggerFactory.getLogger(`Connector.${category}`);
    }
}
