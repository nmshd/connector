import { AxiosRequestConfig } from "axios";
import { AuthenticationProvider } from "./AuthenticationProvider";

export class ApiKeyAuthenticationProvider implements AuthenticationProvider {
    public constructor(
        private readonly apiKey: string,
        private readonly headerName = "x-api-key"
    ) {}

    public authenticate(request: AxiosRequestConfig): void {
        request.headers ??= {};
        request.headers[this.headerName] = this.apiKey;
    }
}
