import { HttpError } from "./HttpError";

export class Envelope {
    protected constructor(public result?: any, public error?: HttpError) {}

    public static ok(result: any): Envelope {
        return new Envelope(result, undefined);
    }

    public static error(error: HttpError): Envelope {
        return new Envelope(undefined, error);
    }
}
