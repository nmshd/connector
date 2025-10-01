import { ConnectorHttpResponse, ConnectorSyncInfo, IdentityInfo } from "../types";
import { Endpoint } from "./Endpoint";

export class AccountEndpoint extends Endpoint {
    public async getIdentityInfo(): Promise<ConnectorHttpResponse<IdentityInfo>> {
        return await this.get("/api/core/v1/Account/IdentityInfo");
    }

    public async sync(): Promise<ConnectorHttpResponse<void>> {
        return await this.post("/api/core/v1/Account/Sync", undefined, 204);
    }

    public async getSyncInfo(): Promise<ConnectorHttpResponse<ConnectorSyncInfo>> {
        return await this.get("/api/core/v1/Account/SyncInfo");
    }
}
