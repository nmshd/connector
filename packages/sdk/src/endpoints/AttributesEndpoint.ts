import { AttributeTagCollectionDTO, LocalAttributeDTO, LocalAttributeForwardingDetailsDTO } from "@nmshd/runtime-types";
import {
    CanCreateOwnIdentityAttributeRequest,
    CanCreateOwnIdentityAttributeResponse,
    ConnectorHttpResponse,
    CreateOwnIdentityAttributeRequest,
    DeleteAttributeAndNotifyResponse,
    ExecuteIQLQueryRequest,
    ExecuteIdentityAttributeQueryRequest,
    ExecuteRelationshipAttributeQueryRequest,
    ExecuteThirdPartyRelationshipAttributeQueryRequest,
    GetAttributesRequest,
    GetForwardingDetailsForAttributeRequest,
    GetOwnAttributesSharedWithPeerRequest,
    GetOwnIdentityAttributesRequest,
    GetPeerAttributesRequest,
    GetVersionsOfAttributeSharedWithPeerRequest,
    NotifyPeerAboutOwnIdentityAttributeSuccessionRequest,
    NotifyPeerAboutOwnIdentityAttributeSuccessionResponse,
    SucceedAttributeRequest,
    SucceedAttributeResponse
} from "../types";
import { Endpoint } from "./Endpoint";

export class AttributesEndpoint extends Endpoint {
    public async canCreateOwnIdentityAttribute(request: CanCreateOwnIdentityAttributeRequest): Promise<ConnectorHttpResponse<CanCreateOwnIdentityAttributeResponse>> {
        return await this.put("/api/core/v1/Attributes/CanCreate", request);
    }

    public async createOwnIdentityAttribute(request: CreateOwnIdentityAttributeRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO>> {
        return await this.post("/api/core/v1/Attributes", request);
    }

    public async succeedAttribute(predecessorId: string, request: SucceedAttributeRequest): Promise<ConnectorHttpResponse<SucceedAttributeResponse>> {
        return await this.post(`/api/core/v1/Attributes/${predecessorId}/Succeed`, request);
    }

    public async notifyPeerAboutOwnIdentityAttributeSuccession(
        attributeId: string,
        request: NotifyPeerAboutOwnIdentityAttributeSuccessionRequest
    ): Promise<ConnectorHttpResponse<NotifyPeerAboutOwnIdentityAttributeSuccessionResponse>> {
        return await this.post(`/api/core/v1/Attributes/${attributeId}/NotifyPeer`, request);
    }

    public async getAttributes(request: GetAttributesRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get("/api/core/v1/Attributes", request);
    }

    public async getAttribute(attributeId: string): Promise<ConnectorHttpResponse<LocalAttributeDTO>> {
        return await this.get(`/api/core/v1/Attributes/${attributeId}`);
    }

    public async getForwardingDetailsForAttribute(request: GetForwardingDetailsForAttributeRequest): Promise<ConnectorHttpResponse<LocalAttributeForwardingDetailsDTO[]>> {
        return await this.get(`/api/core/v1/Attributes/${request.attributeId}/ForwardingDetails`, request.query);
    }

    public async getAttributeTagCollection(): Promise<ConnectorHttpResponse<AttributeTagCollectionDTO>> {
        return await this.get("/api/core/v1/Attributes/TagCollection");
    }

    public async getOwnIdentityAttributes(request?: GetOwnIdentityAttributesRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get("/api/core/v1/Attributes/Own/Identity", request);
    }

    public async getOwnAttributesSharedWithPeer(request: GetOwnAttributesSharedWithPeerRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get(`/api/core/v1/Attributes/Own/Shared/${request.peer}`, {
            onlyLatestVersions: request.onlyLatestVersions,
            hideTechnical: request.hideTechnical,
            ...request.query
        });
    }

    public async getPeerAttributes(request: GetPeerAttributesRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get(`/api/core/v1/Attributes/Peer/${request.peer}`, {
            onlyLatestVersions: request.onlyLatestVersions,
            hideTechnical: request.hideTechnical,
            ...request.query
        });
    }

    public async getVersionsOfAttribute(attributeId: string): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get(`/api/core/v1/Attributes/${attributeId}/Versions`);
    }

    public async getVersionsOfAttributeSharedWithPeer(
        attributeId: string,
        request: GetVersionsOfAttributeSharedWithPeerRequest
    ): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get(`/api/core/v1/Attributes/${attributeId}/Versions/Shared`, request);
    }

    public async deleteAttributeAndNotify(attributeId: string): Promise<ConnectorHttpResponse<DeleteAttributeAndNotifyResponse>> {
        return await this.delete(`/api/core/v1/Attributes/${attributeId}`, undefined);
    }

    public async executeIdentityAttributeQuery(request: ExecuteIdentityAttributeQueryRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.post("/api/core/v1/Attributes/ExecuteIdentityAttributeQuery", request, 200);
    }

    public async executeRelationshipAttributeQuery(request: ExecuteRelationshipAttributeQueryRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO>> {
        return await this.post("/api/core/v1/Attributes/ExecuteRelationshipAttributeQuery", request, 200);
    }

    public async executeThirdPartyRelationshipAttributeQuery(request: ExecuteThirdPartyRelationshipAttributeQueryRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.post("/api/core/v1/Attributes/ExecuteThirdPartyRelationshipAttributeQuery", request, 200);
    }

    public async executeIQLQuery(request: ExecuteIQLQueryRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.post("/api/core/v1/Attributes/ExecuteIQLQuery", request, 200);
    }
}
