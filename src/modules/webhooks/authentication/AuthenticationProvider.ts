import { AxiosRequestConfig } from "axios";

export abstract class AuthenticationProvider {
    public abstract authenticate(config: AxiosRequestConfig): Promise<void> | void;
}
