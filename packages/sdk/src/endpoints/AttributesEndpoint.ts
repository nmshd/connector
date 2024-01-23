import {
    ConnectorAttribute,
    ConnectorAttributes,
    ConnectorResponse,
    CreateIdentityAttributeRequest as CreateRepositoryAttributeRequest,
    ExecuteIQLQueryRequest,
    ExecuteIdentityAttributeQueryRequest,
    ExecuteRelationshipAttributeQueryRequest,
    ExecuteThirdPartyRelationshipAttributeQueryRequest,
    GetAttributesRequest,
    GetValidAttributesRequest,
    NotifyPeerAboutIdentityAttributeSuccessionRequest,
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

    public async notifyPeerAboutIdentityAttributeSuccession(attributeId: string, request: NotifyPeerAboutIdentityAttributeSuccessionRequest): Promise<ConnectorResponse<SucceedAttributeResponse>> {
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
