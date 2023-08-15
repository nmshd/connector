import { ConnectorError } from "./ConnectorError";

export class ConnectorResponse<T> {
    private readonly _error?: ConnectorError;
    private readonly _result?: T;

    protected constructor(
        private readonly _isSuccess: boolean,
        value?: T,
        error?: ConnectorError
    ) {
        if (_isSuccess && error) {
            throw new Error("InvalidOperation: A result cannot be successful and contain an error");
        }
        if (!_isSuccess && !error) {
            throw new Error("InvalidOperation: A failing result needs to contain an error");
        }

        if (value !== undefined && !_isSuccess) {
            throw new Error("InvalidOperation: A value is only useful in case of a success.");
        }

        this._result = value;
        this._error = error;
    }

    public get isSuccess(): boolean {
        return this._isSuccess;
    }

    public get isError(): boolean {
        return !this._isSuccess;
    }

    public get error(): ConnectorError {
        return this._error!;
    }

    public get result(): T {
        if (!this.isSuccess) {
            throw new Error(`Can't get the value of an error Response. Use 'error' instead. Root error: ${this.error.code} - ${this.error.message}`);
        }

        return this._result!;
    }

    public static success<T>(value: T): ConnectorResponse<T> {
        return new ConnectorResponse<T>(true, value);
    }

    public static error<T>(error: ConnectorError): ConnectorResponse<T> {
        return new ConnectorResponse<T>(false, undefined, error);
    }
}
