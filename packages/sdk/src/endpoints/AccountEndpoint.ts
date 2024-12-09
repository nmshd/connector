import { ConnectorHttpResponse, ConnectorSyncInfo, IdentityInfo } from "../types";
import { CorrelationID, Endpoint } from "./Endpoint";

export class AccountEndpoint extends Endpoint {
    public async getIdentityInfo(correlationId?: CorrelationID): Promise<ConnectorHttpResponse<IdentityInfo>> {
        return await this.get("/api/v2/Account/IdentityInfo", undefined, correlationId);
    }

    public async sync(correlationId?: CorrelationID): Promise<ConnectorHttpResponse<void>> {
        return await this.post("/api/v2/Account/Sync", undefined, 204, undefined, correlationId);
    }

    public async getSyncInfo(correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorSyncInfo>> {
        return await this.get("/api/v2/Account/SyncInfo", undefined, correlationId);
    }
}
