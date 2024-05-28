import { ConnectorAttributes, ConnectorRelationship, ConnectorRelationships, ConnectorResponse, CreateRelationshipRequest, GetRelationshipsRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class RelationshipsEndpoint extends Endpoint {
    public async createRelationship(request: CreateRelationshipRequest): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.post("/api/v2/Relationships", request);
    }

    public async getRelationships(request?: GetRelationshipsRequest): Promise<ConnectorResponse<ConnectorRelationships>> {
        return await this.get("/api/v2/Relationships", request);
    }

    public async getRelationship(relationshipId: string): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.get(`/api/v2/Relationships/${relationshipId}`);
    }

    public async acceptRelationship(relationshipId: string): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Accept`);
    }

    public async rejectRelationship(relationshipId: string): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reject`);
    }

    public async getAttributesForRelationship(relationshipId: string): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Relationships/${relationshipId}/Attributes`);
    }
}
