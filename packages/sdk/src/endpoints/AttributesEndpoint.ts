import {
    ConnectorAttribute,
    ConnectorAttributes,
    ConnectorResponse,
    CreateIdentityAttributeRequest,
    CreateRelationshipAttributeRequest,
    ExecuteIQLQueryRequest,
    ExecuteIdentityAttributeQueryRequest,
    ExecuteRelationshipAttributeQueryRequest,
    ExecuteThirdPartyRelationshipAttributeQueryRequest,
    GetAttributesRequest,
    GetValidAttributesRequest,
    NotifyPeerAboutIdentityAttributeSuccessionRequest,
    SucceedIdentityAttributeRequest,
    SucceedRelationshipAttributeRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class AttributesEndpoint extends Endpoint {
    public async createIdentityAttribute(request: CreateIdentityAttributeRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes/IdentityAttribute", request);
    }

    public async createRelationshipAttribute(request: CreateRelationshipAttributeRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes/RelationshipAttribute", request);
    }

    public async succeedIdentityAttribute(request: SucceedIdentityAttributeRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes//succeedIdentityAttribute/:id", request);
    }

    public async succeedRelationshipAttribute(request: SucceedRelationshipAttributeRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes//succeedRelationshipAttribute/:id", request);
    }

    public async notifyPeerAboutIdentityAttributeSuccession(request: NotifyPeerAboutIdentityAttributeSuccessionRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v2/Attributes//notifyPeerAboutIdentityAttributeSuccession", request);
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
