import { ConnectorMode } from "../../../ConnectorMode";
import { HttpError, HttpErrorJSON } from "./HttpError";

export class Envelope<T> {
    protected constructor(
        public result?: T,
        public error?: HttpErrorJSON
    ) {}

    public static ok<T>(result: T): Envelope<T> {
        return new Envelope(result, undefined);
    }

    public static error(error: HttpError, connectorMode: ConnectorMode): Envelope<undefined> {
        switch (connectorMode) {
            case "debug":
                return new Envelope(undefined, error.toJSON("verbose"));
            case "production":
                return new Envelope(undefined, error.toJSON());
        }
    }
}
