import http from "http";
import https from "https";

export interface ConnectorConfig {
    baseUrl: string;
    apiKey: string;
    httpAgent?: http.Agent;
    httpsAgent?: https.Agent;
}
