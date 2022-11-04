import {
    AcceptRelationshipChangeRequest,
    ConnectorAttributes,
    ConnectorRelationship,
    ConnectorRelationships,
    ConnectorResponse,
    CreateRelationshipRequest,
    GetRelationshipsRequest,
    RejectRelationshipChangeRequest
} from "../types";
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

    public async acceptRelationshipChange(
        relationshipId: string,
        changeId: string,
        request: AcceptRelationshipChangeRequest = { content: {} }
    ): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Changes/${changeId}/Accept`, request);
    }

    public async rejectRelationshipChange(
        relationshipId: string,
        changeId: string,
        request: RejectRelationshipChangeRequest = { content: {} }
    ): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v2/Relationships/${relationshipId}/Changes/${changeId}/Reject`, request);
    }

    public async getAttributesForRelationship(relationshipId: string): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Relationships/${relationshipId}/Attributes`);
    }
}
