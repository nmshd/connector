export interface ConnectorRequestValidationResult {
    isSuccess: boolean;

    code?: string;
    message?: string;

    items: ConnectorRequestValidationResult[];
}
