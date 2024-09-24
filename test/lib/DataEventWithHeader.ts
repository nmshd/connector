import { DataEvent } from "@js-soft/ts-utils";
import { IncomingHttpHeaders } from "node:http";

export class DataEventWithHeaders<T> extends DataEvent<T> {
    public readonly headers: IncomingHttpHeaders;

    public constructor(namespace: string, data: T, headers: IncomingHttpHeaders) {
        super(namespace, data);
        this.headers = headers;
    }
}
