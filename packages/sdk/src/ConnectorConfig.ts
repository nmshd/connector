import http from "http";
import https from "https";

export type ConnectorConfig = {
    baseUrl: string;
    httpAgent?: http.Agent;
    httpsAgent?: https.Agent;
} & ({ apiKey: string } | { accessToken: string });
