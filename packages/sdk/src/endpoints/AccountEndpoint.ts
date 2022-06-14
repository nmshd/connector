import { ConnectorResponse, ConnectorSyncInfo, ConnectorSyncResult, IdentityInfo } from "../types";
import { Endpoint } from "./Endpoint";

export class AccountEndpoint extends Endpoint {
    public async getIdentityInfo(): Promise<ConnectorResponse<IdentityInfo>> {
        return await this.get("/api/v1/Account/IdentityInfo");
    }

    public async sync(): Promise<ConnectorResponse<ConnectorSyncResult>> {
        return await this.post("/api/v1/Account/Sync", undefined, 200);
    }

    public async getSyncInfo(): Promise<ConnectorResponse<ConnectorSyncInfo>> {
        return await this.get("/api/v1/Account/SyncInfo");
    }
}
