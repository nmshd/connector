import {
    ConnectorAttribute,
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
import { CorrelationID, Endpoint } from "./Endpoint";

export class AttributesEndpoint extends Endpoint {
    public async createRepositoryAttribute(request: CreateRepositoryAttributeRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes", request, undefined, undefined, correlationId);
    }

    public async succeedAttribute(
        predecessorId: string,
        request: SucceedAttributeRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<SucceedAttributeResponse>> {
        return await this.post(`/api/v2/Attributes/${predecessorId}/Succeed`, request, undefined, undefined, correlationId);
    }

    public async notifyPeerAboutRepositoryAttributeSuccession(
        attributeId: string,
        request: NotifyPeerAboutRepositoryAttributeSuccessionRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<NotifyPeerAboutRepositoryAttributeSuccessionResponse>> {
        return await this.post(`/api/v2/Attributes/${attributeId}/NotifyPeer`, request, undefined, undefined, correlationId);
    }

    public async getAttributes(request: GetAttributesRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes", request, correlationId);
    }

    public async getAttribute(attributeId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorAttribute>> {
        return await this.get(`/api/v2/Attributes/${attributeId}`, undefined, correlationId);
    }

    public async getValidAttributes(request: GetValidAttributesRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Valid", request, correlationId);
    }

    public async getOwnRepositoryAttributes(request?: GetOwnRepositoryAttributesRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Own/Repository", request, correlationId);
    }

    public async getOwnSharedIdentityAttributes(
        request?: GetOwnSharedIdentityAttributesRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Own/Shared/Identity", request, correlationId);
    }

    public async getPeerSharedIdentityAttributes(
        request?: GetPeerSharedIdentityAttributesRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Peer/Shared/Identity", request, correlationId);
    }

    public async getVersionsOfAttribute(attributeId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Attributes/${attributeId}/Versions`, correlationId);
    }

    public async getSharedVersionsOfAttribute(
        attributeId: string,
        request: GetSharedVersionsOfAttributeRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.get(`/api/v2/Attributes/${attributeId}/Versions/Shared`, request, correlationId);
    }

    public async deleteOwnSharedAttributeAndNotifyPeer(
        attributeId: string,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<DeleteOwnSharedAttributeAndNotifyPeerResponse>> {
        return await this.delete(`/api/v2/Attributes/Own/Shared/${attributeId}`, correlationId);
    }

    public async deletePeerSharedAttributeAndNotifyOwner(
        attributeId: string,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<DeletePeerSharedAttributeAndNotifyOwnerResponse>> {
        return await this.delete(`/api/v2/Attributes/Peer/Shared/${attributeId}`, correlationId);
    }

    public async deleteRepositoryAttribute(attributeId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<void>> {
        return await this.delete(`/api/v2/Attributes/${attributeId}`, undefined, 204, correlationId);
    }

    public async deleteThirdPartyRelationshipAttributeAndNotifyPeer(
        attributeId: string,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<DeleteThirdPartyRelationshipAttributeAndNotifyPeerResponse>> {
        return await this.delete(`/api/v2/Attributes/ThirdParty/${attributeId}`, correlationId);
    }

    public async executeIdentityAttributeQuery(request: ExecuteIdentityAttributeQueryRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorAttributes>> {
        return await this.post("/api/v2/Attributes/ExecuteIdentityAttributeQuery", request, 200, undefined, correlationId);
    }

    public async executeRelationshipAttributeQuery(
        request: ExecuteRelationshipAttributeQueryRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes/ExecuteRelationshipAttributeQuery", request, 200, undefined, correlationId);
    }

    public async executeThirdPartyRelationshipAttributeQuery(
        request: ExecuteThirdPartyRelationshipAttributeQueryRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorAttribute[]>> {
        return await this.post("/api/v2/Attributes/ExecuteThirdPartyRelationshipAttributeQuery", request, 200, undefined, correlationId);
    }

    public async executeIQLQuery(request: ExecuteIQLQueryRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorAttribute[]>> {
        return await this.post("/api/v2/Attributes/ExecuteIQLQuery", request, 200, undefined, correlationId);
    }
}
