import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import formDataLib from "form-data";
import { ConnectorHttpResponse } from "../types/ConnectorHttpResponse";

export abstract class Endpoint {
    public constructor(private readonly httpClient: AxiosInstance) {}

    protected async getPlain<T>(path: string): Promise<T> {
        const reponse = await this.httpClient.get<T>(path, { validateStatus: (status) => status === 200 });
        return reponse.data;
    }

    protected async get<T>(path: string, query?: unknown): Promise<ConnectorHttpResponse<T>> {
        const response = await this.httpClient.get(path, {
            params: query
        });

        return this.makeResult(response);
    }

    protected async post<T>(path: string, data?: unknown, expectedStatus?: number, params?: unknown): Promise<ConnectorHttpResponse<T>> {
        const response = await this.httpClient.post(path, data, { params });
        return this.makeResult(response, expectedStatus);
    }

    protected async put<T>(path: string, data?: unknown): Promise<ConnectorHttpResponse<T>> {
        const response = await this.httpClient.put(path, data);
        return this.makeResult(response);
    }

    protected async delete<T>(path: string, params?: unknown, expectedStatus?: number): Promise<ConnectorHttpResponse<T>> {
        const response = await this.httpClient.delete(path, { params });
        return this.makeResult(response, expectedStatus);
    }

    protected makeResult<T>(httpResponse: AxiosResponse<any>, expectedStatus?: number): ConnectorHttpResponse<T> {
        if (!expectedStatus) {
            switch (httpResponse.config.method?.toUpperCase()) {
                case "POST":
                    expectedStatus = 201;
                    break;
                default:
                    expectedStatus = 200;
                    break;
            }
        }

        if (httpResponse.status !== expectedStatus) {
            const errorPayload = httpResponse.data.error;
            if (!errorPayload) {
                throw new Error(
                    `The http request to connector route '${httpResponse.request.path}' failed with status '${httpResponse.status}': ${httpResponse.statusText} ${httpResponse.data}`
                );
            }
            return ConnectorHttpResponse.error({
                id: errorPayload.id,
                docs: errorPayload.docs,
                time: errorPayload.time,
                code: errorPayload.code,
                message: errorPayload.message,
                stacktrace: errorPayload.stacktrace
            });
        }

        if (expectedStatus === 204) return ConnectorHttpResponse.success(undefined as T);

        return ConnectorHttpResponse.success(httpResponse.data.result);
    }

    protected async download(url: string): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        const httpResponse = await this.httpClient.get(url, {
            responseType: "arraybuffer"
        });

        if (httpResponse.status !== 200) {
            // Manually parse data because responseType is "arrayBuffer"
            const errorPayload = JSON.parse(httpResponse.data).error;

            if (!errorPayload) {
                throw new Error(
                    `The http request to connector route '${httpResponse.request.path}' failed with status '${httpResponse.status}': ${httpResponse.statusText} ${httpResponse.data}`
                );
            }

            return ConnectorHttpResponse.error({
                id: errorPayload.id,
                docs: errorPayload.docs,
                time: errorPayload.time,
                code: errorPayload.code,
                message: errorPayload.message
            });
        }

        return ConnectorHttpResponse.success(httpResponse.data as ArrayBuffer);
    }

    protected async downloadQrCode(method: "GET" | "POST", url: string, request?: unknown): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        const config: AxiosRequestConfig = {
            responseType: "arraybuffer",
            headers: {
                accept: "image/png"
            }
        };

        let httpResponse;

        switch (method) {
            case "GET":
                httpResponse = await this.httpClient.get(url, { ...config, params: request });
                break;
            case "POST":
                httpResponse = await this.httpClient.post(url, request, config);
                break;
        }

        const expectedStatus = method === "GET" ? 200 : 201;
        if (httpResponse.status !== expectedStatus) {
            const errorPayload = httpResponse.data.error;

            if (!errorPayload) {
                throw new Error(
                    `The http request to connector route '${httpResponse.request.path}' failed with status '${httpResponse.status}': ${httpResponse.statusText} ${httpResponse.data}`
                );
            }

            return ConnectorHttpResponse.error({
                id: errorPayload.id,
                docs: errorPayload.docs,
                time: errorPayload.time,
                code: errorPayload.code,
                message: errorPayload.message
            });
        }

        return ConnectorHttpResponse.success(httpResponse.data as ArrayBuffer);
    }

    protected async postMultipart(url: string, data: Record<string, unknown>, filename: string): Promise<AxiosResponse<unknown>> {
        const formData = new formDataLib();
        for (const key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }

            const value = data[key];

            if (typeof value === "undefined") continue;

            if (value instanceof Buffer) {
                formData.append(key, value, { filename });
            } else {
                formData.append(key, value);
            }
        }

        const response = await this.httpClient.post(url, formData, {
            headers: formData.getHeaders()
        });

        return response;
    }
}
