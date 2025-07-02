import axios, { InternalAxiosRequestConfig } from "axios";
import { DateTime } from "luxon";
import { IConnectorClientAuthenticator } from "./IConnectorClientAuthenticator";

export class OAuth2ConnectorClientAuthenticator implements IConnectorClientAuthenticator {
    #token: string | null = null;
    #expiresAt: DateTime | null = null;

    readonly #tokenEndpoint: string;
    readonly #clientId: string;
    readonly #clientSecret: string;
    readonly #audience: string;

    public constructor(tokenEndpoint: string, clientId: string, clientSecret: string, audience: string) {
        this.#tokenEndpoint = tokenEndpoint;
        this.#clientId = clientId;
        this.#clientSecret = clientSecret;
        this.#audience = audience;
    }

    public async authenticate(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
        const token = await this.#getOrCreateToken();
        config.headers["Authorization"] = `Bearer ${token}`;

        return config;
    }

    async #getOrCreateToken(): Promise<string> {
        if (this.#token && this.#expiresAt && DateTime.now() < this.#expiresAt) {
            return this.#token;
        }

        return await this.#refreshToken();
    }

    async #refreshToken(): Promise<string> {
        const response = await axios.post(
            this.#tokenEndpoint,
            new URLSearchParams({ grant_type: "client_credentials", client_id: this.#clientId, client_secret: this.#clientSecret, audience: this.#audience }),
            {
                headers: { "content-type": "application/x-www-form-urlencoded" }
            }
        );

        if (!response.data?.access_token) throw new Error("Failed to retrieve access token");

        this.#token = response.data.access_token;
        this.#expiresAt = DateTime.now()
            .plus({ seconds: response.data.expires_in })
            // Subtract 60 seconds for safety
            .minus({ seconds: 30 });

        return this.#token!;
    }
}
