import { InternalAxiosRequestConfig } from "axios";

export interface IConnectorClientAuthenticator {
    authenticate(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig;
}
