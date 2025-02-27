import {
    CanCreateRepositoryAttributeRequest,
    CanCreateRepositoryAttributeResponse,
    ConnectorAttribute,
    ConnectorAttributeTagCollection,
    ConnectorAttributes,
    ConnectorHttpResponse,
    CreateRepositoryAttributeRequest,
    DeleteOwnSharedAttributeAndNotifyPeerResponse,
    DeletePeerSharedAttributeAndNotifyOwnerResponse,
    DeleteThirdPartyRelationshipAttributeAndNotifyPeerResponse,
    ExecuteIQLQueryRequest,
    ExecuteIdentityAttributeQueryRequest,
    ExecuteRelationshipAttributeQueryRequest,
    ExecuteThirdPartyRelationshipAttributeQueryRequest,
    GetAttributesRequest,
    GetOwnRepositoryAttributesRequest,
    GetOwnSharedIdentityAttributesRequest,
    GetPeerSharedIdentityAttributesRequest,
    GetSharedVersionsOfAttributeRequest,
    GetValidAttributesRequest,
    NotifyPeerAboutRepositoryAttributeSuccessionRequest,
    NotifyPeerAboutRepositoryAttributeSuccessionResponse,
    SucceedAttributeRequest,
    SucceedAttributeResponse
} from "../types";
import { Endpoint } from "./Endpoint";

export class AttributesEndpoint extends Endpoint {
    public async canCreateRepositoryAttribute(request: CanCreateRepositoryAttributeRequest): Promise<ConnectorHttpResponse<CanCreateRepositoryAttributeResponse>> {
        return await this.put("/api/v2/Attributes/CanCreate", request);
    }

    public async createRepositoryAttribute(request: CreateRepositoryAttributeRequest): Promise<ConnectorHttpResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes", request);
    }

    public async succeedAttribute(predecessorId: string, request: SucceedAttributeRequest): Promise<ConnectorHttpResponse<SucceedAttributeResponse>> {
        return await this.post(`/api/v2/Attributes/${predecessorId}/Succeed`, request);
    }

    public async notifyPeerAboutRepositoryAttributeSuccession(
        attributeId: string,
        request: NotifyPeerAboutRepositoryAttributeSuccessionRequest
    ): Promise<ConnectorHttpResponse<NotifyPeerAboutRepositoryAttributeSuccessionResponse>> {
        return await this.post(`/api/v2/Attributes/${attributeId}/NotifyPeer`, request);
    }

    public async getAttributes(request: GetAttributesRequest): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes", request);
    }

    public async getAttribute(attributeId: string): Promise<ConnectorHttpResponse<ConnectorAttribute>> {
        return await this.get(`/api/v2/Attributes/${attributeId}`);
    }

    public async getValidAttributes(request: GetValidAttributesRequest): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Valid", request);
    }

    public async getAttributeTagCollection(): Promise<ConnectorHttpResponse<ConnectorAttributeTagCollection>> {
        return await this.get("/api/v2/Attributes/TagCollection");
    }

    public async getOwnRepositoryAttributes(request?: GetOwnRepositoryAttributesRequest): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Own/Repository", request);
    }

    public async getOwnSharedIdentityAttributes(request?: GetOwnSharedIdentityAttributesRequest): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Own/Shared/Identity", request);
    }

    public async getPeerSharedIdentityAttributes(request?: GetPeerSharedIdentityAttributesRequest): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Peer/Shared/Identity", request);
    }

    public async getVersionsOfAttribute(attributeId: string): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Attributes/${attributeId}/Versions`);
    }

    public async getSharedVersionsOfAttribute(attributeId: string, request: GetSharedVersionsOfAttributeRequest): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Attributes/${attributeId}/Versions/Shared`, request);
    }

    public async deleteOwnSharedAttributeAndNotifyPeer(attributeId: string): Promise<ConnectorHttpResponse<DeleteOwnSharedAttributeAndNotifyPeerResponse>> {
        return await this.delete(`/api/v2/Attributes/Own/Shared/${attributeId}`);
    }

    public async deletePeerSharedAttributeAndNotifyOwner(attributeId: string): Promise<ConnectorHttpResponse<DeletePeerSharedAttributeAndNotifyOwnerResponse>> {
        return await this.delete(`/api/v2/Attributes/Peer/Shared/${attributeId}`);
    }

    public async deleteRepositoryAttribute(attributeId: string): Promise<ConnectorHttpResponse<void>> {
        return await this.delete(`/api/v2/Attributes/${attributeId}`, undefined, 204);
    }

    public async deleteThirdPartyRelationshipAttributeAndNotifyPeer(
        attributeId: string
    ): Promise<ConnectorHttpResponse<DeleteThirdPartyRelationshipAttributeAndNotifyPeerResponse>> {
        return await this.delete(`/api/v2/Attributes/ThirdParty/${attributeId}`);
    }

    public async executeIdentityAttributeQuery(request: ExecuteIdentityAttributeQueryRequest): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.post("/api/v2/Attributes/ExecuteIdentityAttributeQuery", request, 200);
    }

    public async executeRelationshipAttributeQuery(request: ExecuteRelationshipAttributeQueryRequest): Promise<ConnectorHttpResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes/ExecuteRelationshipAttributeQuery", request, 200);
    }

    public async executeThirdPartyRelationshipAttributeQuery(request: ExecuteThirdPartyRelationshipAttributeQueryRequest): Promise<ConnectorHttpResponse<ConnectorAttribute[]>> {
        return await this.post("/api/v2/Attributes/ExecuteThirdPartyRelationshipAttributeQuery", request, 200);
    }

    public async executeIQLQuery(request: ExecuteIQLQueryRequest): Promise<ConnectorHttpResponse<ConnectorAttribute[]>> {
        return await this.post("/api/v2/Attributes/ExecuteIQLQuery", request, 200);
    }
}
