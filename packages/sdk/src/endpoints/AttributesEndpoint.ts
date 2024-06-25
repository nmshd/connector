import {
    ConnectorAttribute,
    ConnectorAttributes,
    ConnectorResponse,
    CreateRepositoryAttributeRequest,
    DeleteOwnSharedAttributeAndNotifyPeerResponse,
    DeletePeerSharedAttributeAndNotifyOwnerResponse,
    DeleteThirdPartyOwnedRelationshipAttributeAndNotifyPeerResponse,
    ExecuteIQLQueryRequest,
    ExecuteIdentityAttributeQueryRequest,
    ExecuteRelationshipAttributeQueryRequest,
    ExecuteThirdPartyRelationshipAttributeQueryRequest,
    GetAttributesRequest,
    GetOwnRepositoryAttributesRequest,
    GetOwnSharedIdentityAttributesRequest,
    GetPeerSharedIdentityAttributesRequest,
    GetSharedVersionsOfRepositoryAttributeRequest,
    GetValidAttributesRequest,
    NotifyPeerAboutRepositoryAttributeSuccessionRequest,
    NotifyPeerAboutRepositoryAttributeSuccessionResponse,
    SucceedAttributeRequest,
    SucceedAttributeResponse
} from "../types";
import { Endpoint } from "./Endpoint";

export class AttributesEndpoint extends Endpoint {
    public async createRepositoryAttribute(request: CreateRepositoryAttributeRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes", request);
    }

    public async succeedAttribute(predecessorId: string, request: SucceedAttributeRequest): Promise<ConnectorResponse<SucceedAttributeResponse>> {
        return await this.post(`/api/v2/Attributes/${predecessorId}/Succeed`, request);
    }

    public async notifyPeerAboutRepositoryAttributeSuccession(
        attributeId: string,
        request: NotifyPeerAboutRepositoryAttributeSuccessionRequest
    ): Promise<ConnectorResponse<NotifyPeerAboutRepositoryAttributeSuccessionResponse>> {
        return await this.post(`/api/v2/Attributes/${attributeId}/NotifyPeer`, request);
    }

    public async getAttributes(request: GetAttributesRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes", request);
    }

    public async getAttribute(attributeId: string): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.get(`/api/v2/Attributes/${attributeId}`);
    }

    public async getValidAttributes(request: GetValidAttributesRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Valid", request);
    }

    public async getOwnRepositoryAttributes(request?: GetOwnRepositoryAttributesRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Own/Repository", request);
    }

    public async getOwnSharedIdentityAttributes(request?: GetOwnSharedIdentityAttributesRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Own/Shared/Identity", request);
    }

    public async getPeerSharedIdentityAttributes(request?: GetPeerSharedIdentityAttributesRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Peer/Shared/Identity", request);
    }

    public async getVersionsOfAttribute(attributeId: string): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Attributes/${attributeId}/Versions`);
    }

    public async getSharedVersionsOfAttribute(attributeId: string, request: GetSharedVersionsOfRepositoryAttributeRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Attributes/${attributeId}/Versions/Shared`, request);
    }

    public async deleteOwnSharedAttributeAndNotifyPeer(attributeId: string): Promise<ConnectorResponse<DeleteOwnSharedAttributeAndNotifyPeerResponse>> {
        return await this.delete(`/api/v2/Attributes/Own/Shared/${attributeId}`);
    }

    public async deletePeerSharedAttributeAndNotifyOwner(attributeId: string): Promise<ConnectorResponse<DeletePeerSharedAttributeAndNotifyOwnerResponse>> {
        return await this.delete(`/api/v2/Attributes/Peer/Shared/${attributeId}`);
    }

    public async deleteRepositoryAttribute(attributeId: string): Promise<ConnectorResponse<void>> {
        return await this.delete(`/api/v2/Attributes/${attributeId}`);
    }

    public async deleteThirdPartyOwnedRelationshipAttributeAndNotifyPeer(
        attributeId: string
    ): Promise<ConnectorResponse<DeleteThirdPartyOwnedRelationshipAttributeAndNotifyPeerResponse>> {
        return await this.delete(`/api/v2/Attributes/ThirdParty/${attributeId}`);
    }

    public async executeIdentityAttributeQuery(request: ExecuteIdentityAttributeQueryRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.post("/api/v2/Attributes/ExecuteIdentityAttributeQuery", request, 200);
    }

    public async executeRelationshipAttributeQuery(request: ExecuteRelationshipAttributeQueryRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes/ExecuteRelationshipAttributeQuery", request, 200);
    }

    public async executeThirdPartyRelationshipAttributeQuery(request: ExecuteThirdPartyRelationshipAttributeQueryRequest): Promise<ConnectorResponse<ConnectorAttribute[]>> {
        return await this.post("/api/v2/Attributes/ExecuteThirdPartyRelationshipAttributeQuery", request, 200);
    }

    public async executeIQLQuery(request: ExecuteIQLQueryRequest): Promise<ConnectorResponse<ConnectorAttribute[]>> {
        return await this.post("/api/v2/Attributes/ExecuteIQLQuery", request, 200);
    }
}
