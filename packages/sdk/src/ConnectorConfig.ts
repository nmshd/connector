import http from "http";
import https from "https";
import { IConnectorClientAuthenticator } from "./authentication/IConnectorClientAuthenticator";

export interface ConnectorConfig {
    baseUrl: string;
    httpAgent?: http.Agent;
    httpsAgent?: https.Agent;
    authenticator: IConnectorClientAuthenticator;
}
