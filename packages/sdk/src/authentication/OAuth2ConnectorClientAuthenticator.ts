import { CoreDate } from "@nmshd/core-types";
import axios, { InternalAxiosRequestConfig } from "axios";
import { IConnectorClientAuthenticator } from "./IConnectorClientAuthenticator";

export class OAuth2ConnectorClientAuthenticator implements IConnectorClientAuthenticator {
    #token: string | null = null;
    #expiresAt: CoreDate = CoreDate.utc();

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
        // A token is also considered as expired when 10 seconds are left, to make up for network latency
        const isExpired = this.#expiresAt.subtract({ seconds: 10 }).isExpired();
        if (isExpired || !this.#token) return await this.#refreshToken();

        return this.#token;
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
        this.#expiresAt = CoreDate.utc().add({ seconds: response.data.expires_in });

        return this.#token!;
    }
}
