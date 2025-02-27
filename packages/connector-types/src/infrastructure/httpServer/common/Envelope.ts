import { ConnectorMode } from "../../../ConnectorMode";
import { HttpError, HttpErrorJSON } from "./HttpError";

export class Envelope {
    protected constructor(
        public result?: any,
        public error?: HttpErrorJSON
    ) {}

    public static ok(result: any): Envelope {
        return new Envelope(result, undefined);
    }

    public static error(error: HttpError, connectorMode: ConnectorMode): Envelope {
        switch (connectorMode) {
            case "debug":
                return new Envelope(undefined, error.toJSON("verbose"));
            case "production":
                return new Envelope(undefined, error.toJSON());
        }
    }
}
