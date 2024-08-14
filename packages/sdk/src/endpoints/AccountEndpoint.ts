import { ConnectorHttpResponse, ConnectorSyncInfo, IdentityInfo } from "../types";
import { Endpoint } from "./Endpoint";

export class AccountEndpoint extends Endpoint {
    public async getIdentityInfo(): Promise<ConnectorHttpResponse<IdentityInfo>> {
        return await this.get("/api/v2/Account/IdentityInfo");
    }

    public async sync(): Promise<ConnectorHttpResponse<void>> {
        return await this.post("/api/v2/Account/Sync", undefined, 204);
    }

    public async getSyncInfo(): Promise<ConnectorHttpResponse<ConnectorSyncInfo>> {
        return await this.get("/api/v2/Account/SyncInfo");
    }
}
