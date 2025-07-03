import { InternalAxiosRequestConfig } from "axios";
import { IConnectorClientAuthenticator } from "./IConnectorClientAuthenticator";

export class ApiKeyAuthenticator implements IConnectorClientAuthenticator {
    readonly #apiKey: string;
    readonly #headerName: string;

    public constructor(apiKey: string, headerName = "X-API-KEY") {
        this.#apiKey = apiKey;
        this.#headerName = headerName;
    }

    public authenticate(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
        config.headers[this.#headerName] = this.#apiKey;
        return config;
    }
}
