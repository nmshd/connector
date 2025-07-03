import http from "http";
import https from "https";
import { IConnectorClientAuthenticator } from "./authentication/IConnectorClientAuthenticator";

export type ConnectorConfig = {
    baseUrl: string;
    httpAgent?: http.Agent;
    httpsAgent?: https.Agent;
} & (
    | { authenticator: IConnectorClientAuthenticator }
    | {
          /**
           * @deprecated Use authenticator instead.
           */
          apiKey: string;
      }
);
