import { AxiosRequestConfig } from "axios";

export abstract class TargetAuthenticator {
    public abstract authenticate(config: AxiosRequestConfig): Promise<void> | void;
}
