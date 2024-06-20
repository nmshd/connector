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

    public async revokeRelationship(relationshipId: string): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Revoke`);
    }

    public async getAttributesForRelationship(relationshipId: string): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Relationships/${relationshipId}/Attributes`);
    }

    public async terminateRelationship(relationshipId: string): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Terminate`);
    }

    public async requestRelationshipReactivation(relationshipId: string): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Request`);
    }

    public async acceptRelationshipReactivation(relationshipId: string): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Accept`);
    }

    public async rejectRelationshipReactivation(relationshipId: string): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Reject`);
    }

    public async revokeRelationshipReactivation(relationshipId: string): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Revoke`);
    }
}
