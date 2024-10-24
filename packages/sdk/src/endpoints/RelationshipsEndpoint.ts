import { ConnectorAttributes, ConnectorHttpResponse, ConnectorRelationship, ConnectorRelationships, CreateRelationshipRequest, GetRelationshipsRequest } from "../types";
import { CanCreateRelationshipResponse } from "../types/relationships/responses/CanCreateRelationshipResponse";
import { Endpoint } from "./Endpoint";

export class RelationshipsEndpoint extends Endpoint {
    public async canCreateRelationship(request: CreateRelationshipRequest): Promise<ConnectorHttpResponse<CanCreateRelationshipResponse>> {
        return await this.get("/api/v2/Relationships/CanCreate", request);
    }

    public async createRelationship(request: CreateRelationshipRequest): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.post("/api/v2/Relationships", request);
    }

    public async getRelationships(request?: GetRelationshipsRequest): Promise<ConnectorHttpResponse<ConnectorRelationships>> {
        return await this.get("/api/v2/Relationships", request);
    }

    public async getRelationship(relationshipId: string): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.get(`/api/v2/Relationships/${relationshipId}`);
    }

    public async acceptRelationship(relationshipId: string): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Accept`);
    }

    public async rejectRelationship(relationshipId: string): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reject`);
    }

    public async revokeRelationship(relationshipId: string): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Revoke`);
    }

    public async getAttributesForRelationship(relationshipId: string): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Relationships/${relationshipId}/Attributes`);
    }

    public async terminateRelationship(relationshipId: string): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Terminate`);
    }

    public async decomposeRelationship(relationshipId: string): Promise<ConnectorHttpResponse<void>> {
        return await this.delete(`/api/v2/Relationships/${relationshipId}`, undefined, 204);
    }

    public async requestRelationshipReactivation(relationshipId: string): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate`);
    }

    public async acceptRelationshipReactivation(relationshipId: string): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Accept`);
    }

    public async rejectRelationshipReactivation(relationshipId: string): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Reject`);
    }

    public async revokeRelationshipReactivation(relationshipId: string): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Revoke`);
    }
}
