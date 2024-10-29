import { ConnectorHttpResponse, ConnectorIdentityMetadata } from "../types";
import { Endpoint } from "./Endpoint";

export class IdentityMetadataEndpoint extends Endpoint {
    public async upsertIdentityMetadata(request: any): Promise<ConnectorHttpResponse<ConnectorIdentityMetadata>> {
        return await this.put("/api/v2/IdentityMetadata", request);
    }

    public async getIdentityMetadata(reference: string, key?: string): Promise<ConnectorHttpResponse<ConnectorIdentityMetadata>> {
        return await this.get("/api/v2/IdentityMetadata", { reference: reference, key: key });
    }

    public async deleteIdentityMetadata(reference: string, key?: string): Promise<ConnectorHttpResponse<void>> {
        return await this.delete("/api/v2/IdentityMetadata", { reference: reference, key: key }, 204);
    }
}
