import { ConnectorMode } from "../../../ConnectorMode";
import { HttpError } from "./HttpError";

export class Envelope {
    protected constructor(public result?: any, public error?: HttpError) {}

    public static ok(result: any): Envelope {
        return new Envelope(result, undefined);
    }

    public static error(error: HttpError, connectorMode: ConnectorMode): Envelope {
        switch (connectorMode) {
            case ConnectorMode.Debug:
                return new Envelope(undefined, error);
            case ConnectorMode.Production:
                return new Envelope(undefined, new HttpError(error.code, error.message, error.id, error.time));
        }
    }
}
