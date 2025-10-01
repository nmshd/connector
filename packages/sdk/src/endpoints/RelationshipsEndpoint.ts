import { LocalAttributeDTO, RelationshipDTO } from "@nmshd/runtime-types";
import { CanCreateRelationshipRequest, CanCreateRelationshipResponse, ConnectorHttpResponse, CreateRelationshipRequest, GetRelationshipsRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class RelationshipsEndpoint extends Endpoint {
    public async canCreateRelationship(request: CanCreateRelationshipRequest): Promise<ConnectorHttpResponse<CanCreateRelationshipResponse>> {
        return await this.put("/api/core/v1/Relationships/CanCreate", request);
    }

    public async createRelationship(request: CreateRelationshipRequest): Promise<ConnectorHttpResponse<RelationshipDTO>> {
        return await this.post("/api/core/v1/Relationships", request);
    }

    public async getRelationships(request?: GetRelationshipsRequest): Promise<ConnectorHttpResponse<RelationshipDTO[]>> {
        return await this.get("/api/core/v1/Relationships", request);
    }

    public async getRelationship(relationshipId: string): Promise<ConnectorHttpResponse<RelationshipDTO>> {
        return await this.get(`/api/core/v1/Relationships/${relationshipId}`);
    }

    public async acceptRelationship(relationshipId: string): Promise<ConnectorHttpResponse<RelationshipDTO>> {
        return await this.put(`/api/core/v1/Relationships/${relationshipId}/Accept`);
    }

    public async rejectRelationship(relationshipId: string): Promise<ConnectorHttpResponse<RelationshipDTO>> {
        return await this.put(`/api/core/v1/Relationships/${relationshipId}/Reject`);
    }

    public async revokeRelationship(relationshipId: string): Promise<ConnectorHttpResponse<RelationshipDTO>> {
        return await this.put(`/api/core/v1/Relationships/${relationshipId}/Revoke`);
    }

    public async getAttributesForRelationship(relationshipId: string): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get(`/api/core/v1/Relationships/${relationshipId}/Attributes`);
    }

    public async terminateRelationship(relationshipId: string): Promise<ConnectorHttpResponse<RelationshipDTO>> {
        return await this.put(`/api/core/v1/Relationships/${relationshipId}/Terminate`);
    }

    public async decomposeRelationship(relationshipId: string): Promise<ConnectorHttpResponse<void>> {
        return await this.delete(`/api/core/v1/Relationships/${relationshipId}`, undefined, 204);
    }

    public async requestRelationshipReactivation(relationshipId: string): Promise<ConnectorHttpResponse<RelationshipDTO>> {
        return await this.put(`/api/core/v1/Relationships/${relationshipId}/Reactivate`);
    }

    public async acceptRelationshipReactivation(relationshipId: string): Promise<ConnectorHttpResponse<RelationshipDTO>> {
        return await this.put(`/api/core/v1/Relationships/${relationshipId}/Reactivate/Accept`);
    }

    public async rejectRelationshipReactivation(relationshipId: string): Promise<ConnectorHttpResponse<RelationshipDTO>> {
        return await this.put(`/api/core/v1/Relationships/${relationshipId}/Reactivate/Reject`);
    }

    public async revokeRelationshipReactivation(relationshipId: string): Promise<ConnectorHttpResponse<RelationshipDTO>> {
        return await this.put(`/api/core/v1/Relationships/${relationshipId}/Reactivate/Revoke`);
    }
}
