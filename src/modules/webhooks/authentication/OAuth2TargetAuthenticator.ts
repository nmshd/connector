import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { DateTime } from "luxon";
import { TargetAuthenticator } from "./TargetAuthenticator";

export class OAuth2TargetAuthenticator extends TargetAuthenticator {
    private readonly axios: AxiosInstance;
    private bearerToken: string;
    private expirationDate: DateTime;

    private fetchTokenPromise: Promise<void> | undefined;

    private get isTokenExpired() {
        return DateTime.now() > this.expirationDate.minus({ seconds: 10 });
    }

    public constructor(
        private readonly accessTokenUrl: string,
        private readonly clientId: string,
        private readonly clientSecret: string,
        private readonly scope?: string
    ) {
        super();

        this.axios = axios.create({ maxRedirects: 0 });
        this.bearerToken = "";
        this.expirationDate = DateTime.now();
    }

    public override async authenticate(config: AxiosRequestConfig): Promise<void> {
        const token = await this.getToken();

        config.headers ??= {};
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    private async getToken(): Promise<string> {
        if (this.fetchTokenPromise) {
            await this.fetchTokenPromise;
            return this.bearerToken;
        }

        if (this.isTokenExpired) {
            this.fetchTokenPromise = this.refreshToken();
            try {
                await this.fetchTokenPromise;
            } finally {
                this.fetchTokenPromise = undefined;
            }
        }

        return this.bearerToken;
    }

    private async refreshToken() {
        const response = await this.axios.post(
            this.accessTokenUrl,
            {
                grant_type: "client_credentials",
                scope: this.scope
            },
            {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                auth: {
                    username: this.clientId,
                    password: this.clientSecret
                }
            }
        );

        if (response.status !== 200) {
            throw new Error(`Failed to fetch token: ${response.statusText}`);
        }

        this.expirationDate = DateTime.now().plus({ seconds: response.data.expires_in });
        this.bearerToken = response.data.access_token;
    }
}
