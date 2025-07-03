import http from "http";
import https from "https";
import { IConnectorClientAuthenticator } from "./authentication/IConnectorClientAuthenticator";

export type ConnectorClientConfig = {
    baseUrl: string;
    httpAgent?: http.Agent;
    httpsAgent?: https.Agent;
} & (
    | { authenticator: IConnectorClientAuthenticator }
    | {
          /**
           * @deprecated Instead, set the `authenticator` property to `new ApiKeyAuthenticator(<api_key>)`
           */
          apiKey: string;
      }
);
