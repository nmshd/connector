import { ConnectorAttributes, ConnectorRelationship, ConnectorRelationships, CreateRelationshipRequest, GetRelationshipsRequest, Response } from "../types";
import { Endpoint } from "./Endpoint";

export class RelationshipsEndpoint extends Endpoint {
    public async createRelationship(request: CreateRelationshipRequest): Promise<Response<ConnectorRelationship>> {
        return await this.post("/api/v2/Relationships", request);
    }

    public async getRelationships(request?: GetRelationshipsRequest): Promise<Response<ConnectorRelationships>> {
        return await this.get("/api/v2/Relationships", request);
    }

    public async getRelationship(relationshipId: string): Promise<Response<ConnectorRelationship>> {
        return await this.get(`/api/v2/Relationships/${relationshipId}`);
    }

    public async acceptRelationship(relationshipId: string): Promise<Response<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Accept`);
    }

    public async rejectRelationship(relationshipId: string): Promise<Response<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reject`);
    }

    public async revokeRelationship(relationshipId: string): Promise<Response<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Revoke`);
    }

    public async getAttributesForRelationship(relationshipId: string): Promise<Response<ConnectorAttributes>> {
        return await this.get(`/api/v2/Relationships/${relationshipId}/Attributes`);
    }

    public async terminateRelationship(relationshipId: string): Promise<Response<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Terminate`);
    }

    public async decomposeRelationship(relationshipId: string): Promise<Response<void>> {
        return await this.delete(`/api/v2/Relationships/${relationshipId}`, undefined, 204);
    }

    public async requestRelationshipReactivation(relationshipId: string): Promise<Response<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate`);
    }

    public async acceptRelationshipReactivation(relationshipId: string): Promise<Response<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Accept`);
    }

    public async rejectRelationshipReactivation(relationshipId: string): Promise<Response<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Reject`);
    }

    public async revokeRelationshipReactivation(relationshipId: string): Promise<Response<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Revoke`);
    }
}
