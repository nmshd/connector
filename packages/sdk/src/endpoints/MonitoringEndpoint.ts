import { RuntimeHealth } from "@nmshd/runtime-types";
import { ConnectorRequestCount, ConnectorSupportInformation, ConnectorVersionInfo } from "../types/monitoring";
import { Endpoint } from "./Endpoint";

export class MonitoringEndpoint extends Endpoint {
    public async getHealth(): Promise<RuntimeHealth> {
        return await this.getPlain("/health", (status) => status === 200 || status === 500);
    }

    public async getVersion(): Promise<ConnectorVersionInfo> {
        return await this.getPlain("/Monitoring/Version");
    }

    public async getRequests(): Promise<ConnectorRequestCount> {
        return await this.getPlain("/Monitoring/Requests");
    }

    public async getSupport(): Promise<ConnectorSupportInformation> {
        return await this.getPlain("/Monitoring/Support");
    }
}
