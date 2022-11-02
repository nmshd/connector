export interface ConnectorError {
    id: string;
    code: string;
    message: string;
    docs: string;
    time: string;
    stacktrace?: string[];
}
