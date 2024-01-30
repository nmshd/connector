import { ConnectorConfig } from "@nmshd/connector-sdk";
import OpenAPIClientAxios from "openapi-client-axios";
import yamljs from "yamljs";
import { Client as ConnectorClientNew } from "./api";

export class ConnectorClient {
    public static async create(opt: ConnectorConfig): Promise<ConnectorClientNew> {
        const shema = yamljs.load("../../src/modules/coreHttpApi/openapi.yml");
        const api = new OpenAPIClientAxios({
            definition: shema,
            withServer: { url: opt.baseUrl },
            axiosConfigDefaults: {
                headers: {
                    "X-API-KEY": opt.apiKey // eslint-disable-line @typescript-eslint/naming-convention
                },
                httpAgent: opt.httpAgent,
                httpsAgent: opt.httpsAgent
            }
        });

        const client = await api.init<ConnectorClientNew>();
        return client;
    }
}
