import {
    CanCreateRelationshipRequest,
    CanCreateRelationshipResponse,
    ConnectorAttributes,
    ConnectorHttpResponse,
    ConnectorRelationship,
    ConnectorRelationships,
    CreateRelationshipRequest,
    GetRelationshipsRequest
} from "../types";
import { CorrelationID, Endpoint } from "./Endpoint";

export class RelationshipsEndpoint extends Endpoint {
    public async canCreateRelationship(request: CanCreateRelationshipRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<CanCreateRelationshipResponse>> {
        return await this.put("/api/v2/Relationships/CanCreate", request, correlationId);
    }

    public async createRelationship(request: CreateRelationshipRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.post("/api/v2/Relationships", request, undefined, undefined, correlationId);
    }

    public async getRelationships(request?: GetRelationshipsRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationships>> {
        return await this.get("/api/v2/Relationships", request, correlationId);
    }

    public async getRelationship(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.get(`/api/v2/Relationships/${relationshipId}`, undefined, correlationId);
    }

    public async acceptRelationship(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Accept`, undefined, correlationId);
    }

    public async rejectRelationship(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reject`, undefined, correlationId);
    }

    public async revokeRelationship(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Revoke`, undefined, correlationId);
    }

    public async getAttributesForRelationship(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Relationships/${relationshipId}/Attributes`, undefined, correlationId);
    }

    public async terminateRelationship(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Terminate`, undefined, correlationId);
    }

    public async decomposeRelationship(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<void>> {
        return await this.delete(`/api/v2/Relationships/${relationshipId}`, undefined, 204, correlationId);
    }

    public async requestRelationshipReactivation(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate`, undefined, correlationId);
    }

    public async acceptRelationshipReactivation(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Accept`, undefined, correlationId);
    }

    public async rejectRelationshipReactivation(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Reject`, undefined, correlationId);
    }

    public async revokeRelationshipReactivation(relationshipId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Reactivate/Revoke`, undefined, correlationId);
    }
}
