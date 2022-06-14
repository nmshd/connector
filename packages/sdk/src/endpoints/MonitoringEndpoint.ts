import { ConnectorHealth, ConnectorRequestCount, ConnectorSupportInformation, ConnectorVersionInfo } from "../types/monitoring";
import { Endpoint } from "./Endpoint";

export class MonitoringEndpoint extends Endpoint {
    public async getHealth(): Promise<ConnectorHealth> {
        return await this.getPlain("/health");
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
