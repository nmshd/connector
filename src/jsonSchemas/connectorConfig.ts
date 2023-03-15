/* eslint-disable @typescript-eslint/naming-convention */
// To regenerate the json schema, execute the following command:
// npx ts-json-schema-generator -p ./src/jsonSchemas/connectorConfig.ts -o ./src/jsonSchemas/connectorConfig.json -t "ConnectorConfig" --no-top-ref

export interface ConnectorConfig {
    debug: boolean;

    database: {
        connectionString: string;
        dbName: string;
    };

    transportLibrary: IConfigOverwrite;

    logging: Log4jsConfiguration;

    modules: Record<string, ModuleConfiguration>;
    infrastructure: InfrastructureConfiguration;

    [key: string]: any;
}

interface ModuleConfiguration {
    enabled: boolean;
    displayName: string;
    location: string;
    requiredInfrastructure?: string[];
    [key: string]: any;
}

interface InfrastructureConfiguration {
    httpServer: {
        enabled: boolean;
        port?: string | number;
        apiKey: string;
        cors?: any;
    };
}

// ================================ Transport Library ================================

interface IConfigOverwrite {
    platformClientId?: string;
    platformClientSecret?: string;
    platformTimeout?: number;
    platformMaxRedirects?: number;
    platformMaxContentLength?: number;
    platformAdditionalHeaders?: object;
    baseUrl?: string;
    realm?: Realm;
    datawalletEnabled?: boolean;
    debug?: boolean;
}

declare enum Realm {
    Dev = "dev",
    Stage = "id0",
    Prod = "id1"
}

// ================================ log4js ================================

interface BaseLayout {
    type: "basic";
}

interface ColoredLayout {
    type: "colored" | "coloured";
}

interface MessagePassThroughLayout {
    type: "messagePassThrough";
}

interface DummyLayout {
    type: "dummy";
}

interface Level {
    colour: string;
    level: number;
    levelStr: string;
}

interface PatternLayout {
    type: "pattern";
    // specifier for the output format, using placeholders as described below
    pattern: string;
    // user-defined tokens to be used in the pattern
    tokens?: Record<string, string>;
}

interface CustomLayout {
    [key: string]: any;
    type: string;
}

type Layout = BaseLayout | ColoredLayout | MessagePassThroughLayout | DummyLayout | PatternLayout | CustomLayout;

/**
 * Category Filter
 *
 * @see https://log4js-node.github.io/log4js-node/categoryFilter.html
 */
interface CategoryFilterAppender {
    type: "categoryFilter";
    // the category (or categories if you provide an array of values) that will be excluded from the appender.
    exclude?: string | string[];
    // the name of the appender to filter. see https://log4js-node.github.io/log4js-node/layouts.html
    appender?: string;
}

/**
 * No Log Filter
 *
 * @see https://log4js-node.github.io/log4js-node/noLogFilter.html
 */
interface NoLogFilterAppender {
    type: "noLogFilter";
    // the regular expression (or the regular expressions if you provide an array of values)
    // will be used for evaluating the events to pass to the appender.
    // The events, which will match the regular expression, will be excluded and so not logged.
    exclude: string | string[];
    // the name of an appender, defined in the same configuration, that you want to filter.
    appender: string;
}

/**
 * Console Appender
 *
 * @see https://log4js-node.github.io/log4js-node/console.html
 */
interface ConsoleAppender {
    type: "console";
    // defaults to colouredLayout
    layout?: Layout;
}

interface FileAppender {
    type: "file";
    // the path of the file where you want your logs written.
    filename: string;
    // the maximum size (in bytes) for the log file. If not specified, then no log rolling will happen.
    maxLogSize?: number | string;
    // (default value = 5) - the number of old log files to keep during log rolling.
    backups?: number;
    // defaults to basic layout
    layout?: Layout;
    numBackups?: number;
    compress?: boolean; // compress the backups
    // keep the file extension when rotating logs
    keepFileExt?: boolean;
    encoding?: string;
    mode?: number;
    flags?: string;
}

interface SyncfileAppender {
    type: "fileSync";
    // the path of the file where you want your logs written.
    filename: string;
    // the maximum size (in bytes) for the log file. If not specified, then no log rolling will happen.
    maxLogSize?: number | string;
    // (default value = 5) - the number of old log files to keep during log rolling.
    backups?: number;
    // defaults to basic layout
    layout?: Layout;
}

interface DateFileAppender {
    type: "dateFile";
    // the path of the file where you want your logs written.
    filename: string;
    // defaults to basic layout
    layout?: Layout;
    // defaults to .yyyy-MM-dd - the pattern to use to determine when to roll the logs.
    /**
     * The following strings are recognised in the pattern:
     *  - yyyy : the full year, use yy for just the last two digits
     *  - MM   : the month
     *  - dd   : the day of the month
     *  - hh   : the hour of the day (24-hour clock)
     *  - mm   : the minute of the hour
     *  - ss   : seconds
     *  - SSS  : milliseconds (although I'm not sure you'd want to roll your logs every millisecond)
     *  - O    : timezone (capital letter o)
     */
    pattern?: string;
    // default “utf-8”
    encoding?: string;
    // default 0644
    mode?: number;
    // default ‘a’
    flags?: string;
    // compress the backup files during rolling (backup files will have .gz extension)(default false)
    compress?: boolean;
    // include the pattern in the name of the current log file as well as the backups.(default false)
    alwaysIncludePattern?: boolean;
    // keep the file extension when rotating logs
    keepFileExt?: boolean;
    // if this value is greater than zero, then files older than that many days will be deleted during log rolling.(default 0)
    daysToKeep?: number;
}

interface LogLevelFilterAppender {
    type: "logLevelFilter";
    // the name of an appender, defined in the same configuration, that you want to filter
    appender: string;
    // the minimum level of event to allow through the filter
    level: string;
    // (defaults to FATAL) - the maximum level of event to allow through the filter
    maxLevel?: string;
}

interface MultiFileAppender {
    type: "multiFile";
    // the base part of the generated log filename
    base: string;
    // the value to use to split files (see below).
    property: string;
    // the suffix for the generated log filename.
    extension: string;
}

interface MultiprocessAppender {
    type: "multiprocess";
    // controls whether the appender listens for log events sent over the network, or is responsible for serialising events and sending them to a server.
    mode: "master" | "worker";
    // (only needed if mode == master)- the name of the appender to send the log events to
    appender?: string;
    // (defaults to 5000) - the port to listen on, or send to
    loggerPort?: number;
    // (defaults to localhost) - the host/IP address to listen on, or send to
    loggerHost?: string;
}

interface RecordingAppender {
    type: "recording";
}

interface StandardErrorAppender {
    type: "stderr";
    // (defaults to colouredLayout)
    layout?: Layout;
}

interface StandardOutputAppender {
    type: "stdout";
    // (defaults to colouredLayout)
    layout?: Layout;
}

interface CustomAppender {
    type: string | AppenderModule;
    [key: string]: any;
}

interface AppenderModule {}

type Appender =
    | CategoryFilterAppender
    | ConsoleAppender
    | FileAppender
    | SyncfileAppender
    | DateFileAppender
    | LogLevelFilterAppender
    | NoLogFilterAppender
    | MultiFileAppender
    | MultiprocessAppender
    | RecordingAppender
    | StandardErrorAppender
    | StandardOutputAppender
    | CustomAppender;

interface Levels {
    ALL: Level;
    MARK: Level;
    TRACE: Level;
    DEBUG: Level;
    INFO: Level;
    WARN: Level;
    ERROR: Level;
    FATAL: Level;
    OFF: Level;
    levels: Level[];
}

interface Log4jsConfiguration {
    appenders: Record<string, Appender>;
    categories: Record<string, { appenders: string[]; level: string; enableCallStack?: boolean }>;
    pm2?: boolean;
    pm2InstanceVar?: string;
    levels?: Levels;
    disableClustering?: boolean;
}
