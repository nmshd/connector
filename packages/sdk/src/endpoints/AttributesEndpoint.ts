import {
    ConnectorAttribute,
    ConnectorAttributes,
    ConnectorResponse,
    CreateRepositoryAttributeRequest,
    ExecuteIQLQueryRequest,
    ExecuteIdentityAttributeQueryRequest,
    ExecuteRelationshipAttributeQueryRequest,
    ExecuteThirdPartyRelationshipAttributeQueryRequest,
    GetAttributesRequest,
    GetValidAttributesRequest,
    NotifyPeerAboutIdentityAttributeSuccessionRequest,
    NotifyPeerAboutIdentityAttributeSuccessionResponse,
    SucceedAttributeRequest,
    SucceedAttributeResponse
} from "../types";
import { GetOwnRepositoryAttributes } from "../types/attributes/requests/GetOwnRepositoryAttributesRequest";
import { GetOwnSharedIdentityAttributesRequest } from "../types/attributes/requests/GetOwnSharedIdentityAttributes";
import { Endpoint } from "./Endpoint";

export class AttributesEndpoint extends Endpoint {
    public async createRepositoryAttribute(request: CreateRepositoryAttributeRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes", request);
    }

    public async succeedAttribute(predecessorId: string, request: SucceedAttributeRequest): Promise<ConnectorResponse<SucceedAttributeResponse>> {
        return await this.post(`/api/v2/Attributes/${predecessorId}/Succeed`, request);
    }

    public async notifyPeerAboutIdentityAttributeSuccession(
        attributeId: string,
        request: NotifyPeerAboutIdentityAttributeSuccessionRequest
    ): Promise<ConnectorResponse<NotifyPeerAboutIdentityAttributeSuccessionResponse>> {
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

    public async getOwnRepositoryAttributes(request?: GetOwnRepositoryAttributes): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Own/Repository", request);
    }
    public async getOwnSharedIdentityAttributes(request?: GetOwnSharedIdentityAttributesRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get("/api/v2/Attributes/Own/Shared", request);
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
