import { ConnectorSyncInfo, IdentityInfo, Response } from "../types";
import { Endpoint } from "./Endpoint";

export class AccountEndpoint extends Endpoint {
    public async getIdentityInfo(): Promise<Response<IdentityInfo>> {
        return await this.get("/api/v2/Account/IdentityInfo");
    }

    public async sync(): Promise<Response<void>> {
        return await this.post("/api/v2/Account/Sync", undefined, 204);
    }

    public async getSyncInfo(): Promise<Response<ConnectorSyncInfo>> {
        return await this.get("/api/v2/Account/SyncInfo");
    }
}
