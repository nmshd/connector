import { ConnectorHttpResponse, ConnectorIdentityMetadata, UpsertIdentityMetadataRequest } from "../types";
import { CorrelationID, Endpoint } from "./Endpoint";

export class IdentityMetadataEndpoint extends Endpoint {
    public async upsertIdentityMetadata(request: UpsertIdentityMetadataRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorIdentityMetadata>> {
        return await this.put("/api/v2/IdentityMetadata", request, correlationId);
    }

    public async getIdentityMetadata(reference: string, key?: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorIdentityMetadata>> {
        return await this.get("/api/v2/IdentityMetadata", { reference: reference, key: key }, correlationId);
    }

    public async deleteIdentityMetadata(reference: string, key?: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<void>> {
        return await this.delete("/api/v2/IdentityMetadata", { reference: reference, key: key }, 204, correlationId);
    }
}
