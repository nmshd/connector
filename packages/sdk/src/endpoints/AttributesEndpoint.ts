import {
    ConnectorAttribute,
    ConnectorAttributes,
    ConnectorResponse,
    CreateAttributeRequest,
    ExecuteIdentityAttributeQueryRequest,
    ExecuteRelationshipAttributeQueryRequest,
    GetAttributesRequest,
    GetValidAttributesRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class AttributesEndpoint extends Endpoint {
    public async createAttribute(request: CreateAttributeRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v1/Attributes", request);
    }

    public async getAttributes(request: GetAttributesRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get("/api/v1/Attributes", request);
    }

    public async getAttribute(attributeId: string): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.get(`/api/v1/Attributes/${attributeId}`);
    }

    public async getValidAttributes(request: GetValidAttributesRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get("/api/v1/Attributes/Valid", request);
    }

    public async executeIdentityAttributeQuery(request: ExecuteIdentityAttributeQueryRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.post("/api/v1/Attributes/ExecuteIdentityAttributeQuery", request, 200);
    }

    public async executeRelationshipAttributeQuery(request: ExecuteRelationshipAttributeQueryRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.post("/api/v1/Attributes/ExecuteRelationshipAttributeQuery", request, 200);
    }
}
