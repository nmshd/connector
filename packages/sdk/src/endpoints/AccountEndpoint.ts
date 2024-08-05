import { ConnectorResponse, ConnectorSyncInfo, IdentityInfo } from "../types";
import { Endpoint } from "./Endpoint";

export class AccountEndpoint extends Endpoint {
    public async getIdentityInfo(): Promise<ConnectorResponse<IdentityInfo>> {
        return await this.get("/api/v2/Account/IdentityInfo");
    }

    public async sync(): Promise<ConnectorResponse<void>> {
        return await this.post("/api/v2/Account/Sync", undefined, 204);
    }

    public async getSyncInfo(): Promise<ConnectorResponse<ConnectorSyncInfo>> {
        return await this.get("/api/v2/Account/SyncInfo");
    }
}
