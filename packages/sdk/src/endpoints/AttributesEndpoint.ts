import { AttributeTagCollectionDTO, LocalAttributeDTO } from "@nmshd/runtime-types";
import {
    CanCreateRepositoryAttributeRequest,
    CanCreateRepositoryAttributeResponse,
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
    NotifyPeerAboutRepositoryAttributeSuccessionRequest,
    NotifyPeerAboutRepositoryAttributeSuccessionResponse,
    SucceedAttributeRequest,
    SucceedAttributeResponse
} from "../types";
import { Endpoint } from "./Endpoint";

export class AttributesEndpoint extends Endpoint {
    public async canCreateRepositoryAttribute(request: CanCreateRepositoryAttributeRequest): Promise<ConnectorHttpResponse<CanCreateRepositoryAttributeResponse>> {
        return await this.put("/api/v2/Attributes/CanCreate", request);
    }/api/core/v1

    public async createRepositoryAttribute(request: CreateRepositoryAttributeRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO>> {
        return await this.post("/api/v2/Attributes", request);
    }/api/core/v1

    public async succeedAttribute(predecessorId: string, request: SucceedAttributeRequest): Promise<ConnectorHttpResponse<SucceedAttributeResponse>> {
        return await this.post(`/api/v2/Attributes/${predecessorId}/Succeed`, request);
    }/api/core/v1

    public async notifyPeerAboutRepositoryAttributeSuccession(
        attributeId: string,
        request: NotifyPeerAboutRepositoryAttributeSuccessionRequest
    ): Promise<ConnectorHttpResponse<NotifyPeerAboutRepositoryAttributeSuccessionResponse>> {
        return await this.post(`/api/v2/Attributes/${attributeId}/NotifyPeer`, request);
    }/api/core/v1

    public async getAttributes(request: GetAttributesRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get("/api/v2/Attributes", request);
    }/api/core/v1

    public async getAttribute(attributeId: string): Promise<ConnectorHttpResponse<LocalAttributeDTO>> {
        return await this.get(`/api/v2/Attributes/${attributeId}`);
    }/api/core/v1

    public async getAttributeTagCollection(): Promise<ConnectorHttpResponse<AttributeTagCollectionDTO>> {
        return await this.get("/api/v2/Attributes/TagCollection");
    }/api/core/v1

    public async getOwnRepositoryAttributes(request?: GetOwnRepositoryAttributesRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get("/api/v2/Attributes/Own/Repository", request);
    }/api/core/v1

    public async getOwnSharedIdentityAttributes(request: GetOwnSharedIdentityAttributesRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get("/api/v2/Attributes/Own/Shared/Identity", request);
    }/api/core/v1

    public async getPeerSharedIdentityAttributes(request: GetPeerSharedIdentityAttributesRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get("/api/v2/Attributes/Peer/Shared/Identity", request);
    }/api/core/v1

    public async getVersionsOfAttribute(attributeId: string): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get(`/api/v2/Attributes/${attributeId}/Versions`);
    }/api/core/v1

    public async getSharedVersionsOfAttribute(attributeId: string, request: GetSharedVersionsOfAttributeRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.get(`/api/v2/Attributes/${attributeId}/Versions/Shared`, request);
    }/api/core/v1

    public async deleteOwnSharedAttributeAndNotifyPeer(attributeId: string): Promise<ConnectorHttpResponse<DeleteOwnSharedAttributeAndNotifyPeerResponse>> {
        return await this.delete(`/api/v2/Attributes/Own/Shared/${attributeId}`);
    }/api/core/v1

    public async deletePeerSharedAttributeAndNotifyOwner(attributeId: string): Promise<ConnectorHttpResponse<DeletePeerSharedAttributeAndNotifyOwnerResponse>> {
        return await this.delete(`/api/v2/Attributes/Peer/Shared/${attributeId}`);
    }/api/core/v1

    public async deleteRepositoryAttribute(attributeId: string): Promise<ConnectorHttpResponse<void>> {
        return await this.delete(`/api/v2/Attributes/${attributeId}`, undefined, 204);
    }/api/core/v1

    public async deleteThirdPartyRelationshipAttributeAndNotifyPeer(
        attributeId: string
    ): Promise<ConnectorHttpRespon/api/core/v1teThirdPartyRelationshipAttributeAndNotifyPeerResponse>> {
        return await this.delete(`/api/v2/Attributes/ThirdParty/${attributeId}`);
    }

    public async executeIdentityAttributeQuery(request: ExecuteIdentityAttributeQueryRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.post("/api/v2/Attributes/ExecuteIdentityAttributeQuery", request, 200);
    }/api/core/v1

    public async executeRelationshipAttributeQuery(request: ExecuteRelationshipAttributeQueryRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO>> {
        return await this.post("/api/v2/Attributes/ExecuteRelationshipAttributeQuery", request, 200);
    }/api/core/v1

    public async executeThirdPartyRelationshipAttributeQuery(request: ExecuteThirdPartyRelationshipAttributeQueryRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.post("/api/v2/Attributes/ExecuteThirdPartyRelationshipAttributeQuery", request, 200);
    }/api/core/v1

    public async executeIQLQuery(request: ExecuteIQLQueryRequest): Promise<ConnectorHttpResponse<LocalAttributeDTO[]>> {
        return await this.post("/api/v2/Attributes/ExecuteIQLQuery", request, 200);
    }/api/core/v1
}
/api/core/v1