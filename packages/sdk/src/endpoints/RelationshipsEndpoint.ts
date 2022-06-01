import { AxiosInstance } from "axios";
import {
    AcceptRelationshipChangeRequest,
    ConnectorAttribute,
    ConnectorRelationship,
    ConnectorRelationships,
    ConnectorResponse,
    CreateRelationshipRequest,
    GetRelationshipsRequest,
    RejectRelationshipChangeRequest,
    RevokeRelationshipChangeRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class RelationshipsEndpoint extends Endpoint {
    public constructor(axiosInstance: AxiosInstance) {
        super(axiosInstance);
    }

    public async createRelationship(request: CreateRelationshipRequest): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.post("/api/v1/Relationships", request);
    }

    public async getRelationships(request?: GetRelationshipsRequest): Promise<ConnectorResponse<ConnectorRelationships>> {
        return await this.get("/api/v1/Relationships", request);
    }

    public async getRelationship(relationshipId: string): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.get(`/api/v1/Relationships/${relationshipId}`);
    }

    public async acceptRelationshipChange(
        relationshipId: string,
        changeId: string,
        request: AcceptRelationshipChangeRequest = { content: {} }
    ): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v1/Relationships/${relationshipId}/Changes/${changeId}/Accept`, request);
    }

    public async rejectRelationshipChange(
        relationshipId: string,
        changeId: string,
        request: RejectRelationshipChangeRequest = { content: {} }
    ): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v1/Relationships/${relationshipId}/Changes/${changeId}/Reject`, request);
    }

    public async revokeRelationshipChange(
        relationshipId: string,
        changeId: string,
        request: RevokeRelationshipChangeRequest = { content: {} }
    ): Promise<ConnectorResponse<ConnectorRelationship>> {
        return await this.put(`/api/v1/Relationships/${relationshipId}/Changes/${changeId}/Revoke`, request);
    }

    public async getAttributesForRelationship(relationshipId: string): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.get(`/api/v1/Relationships/${relationshipId}/Attributes`);
    }
}
