import { AxiosRequestConfig } from "axios";
import { TargetAuthenticator } from "./TargetAuthenticator";

export class ApiKeyTargetAuthenticator implements TargetAuthenticator {
    public constructor(
        private readonly apiKey: string,
        private readonly headerName = "x-api-key"
    ) {}

    public authenticate(request: AxiosRequestConfig): void {
        request.headers ??= {};
        request.headers[this.headerName] = this.apiKey;
    }
}
