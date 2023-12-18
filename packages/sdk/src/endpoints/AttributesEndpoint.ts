import {
    ConnectorAttribute,
    ConnectorAttributes,
    ConnectorIdentityAttribute,
    ConnectorRequest,
    ConnectorResponse,
    CreateAndShareRelationshipAttributeRequest,
    CreateIdentityAttributeRequest,
    ExecuteIQLQueryRequest,
    ExecuteIdentityAttributeQueryRequest,
    ExecuteRelationshipAttributeQueryRequest,
    ExecuteThirdPartyRelationshipAttributeQueryRequest,
    GetAttributesRequest,
    GetValidAttributesRequest,
    NotifyPeerAboutIdentityAttributeSuccessionRequest,
    ShareIdentityAttributeRequest,
    SucceedAttributeRequest,
    SucceedAttributeResponse,
    SucceedIdentityAttributeRequest,
    SucceedRelationshipAttributeAndNotifyPeerRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class AttributesEndpoint extends Endpoint {
    public async createAttribute(request: ConnectorIdentityAttribute): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes", request);
    }

    public async createIdentityAttribute(request: CreateIdentityAttributeRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes/CreateIdentityAttribute", request);
    }

    public async createAndShareRelationshipAttribute(request: CreateAndShareRelationshipAttributeRequest): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.post("/api/v2/Attributes/CreateAndShareRelationshipAttribute", request);
    }

    public async succeedAttribute(request: SucceedAttributeRequest): Promise<ConnectorResponse<SucceedAttributeResponse>> {
        return await this.post("/api/v2/Attributes/SucceedAttribute", request);
    }

    public async succeedIdentityAttribute(request: SucceedIdentityAttributeRequest): Promise<ConnectorResponse<SucceedAttributeResponse>> {
        return await this.post("/api/v2/Attributes/SucceedIdentityAttribute", request);
    }

    public async succeedRelationshipAttributeAndNotifyPeer(request: SucceedRelationshipAttributeAndNotifyPeerRequest): Promise<ConnectorResponse<SucceedAttributeResponse>> {
        return await this.post("/api/v2/Attributes/SucceedRelationshipAttributeAndNotifyPeer", request);
    }

    public async shareIdentityAttribute(request: ShareIdentityAttributeRequest): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.post("/api/v2/Attributes/ShareIdentityAttribute", request);
    }

    public async notifyPeerAboutIdentityAttributeSuccession(request: NotifyPeerAboutIdentityAttributeSuccessionRequest): Promise<ConnectorResponse<SucceedAttributeResponse>> {
        return await this.post("/api/v2/Attributes/NotifyPeerAboutIdentityAttributeSuccession", request);
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
