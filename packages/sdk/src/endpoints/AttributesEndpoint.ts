import { AxiosInstance } from "axios";
import { ConnectorAttribute, ConnectorAttributes, ConnectorResponse, CreateAttributeRequest, GetAttributesRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class AttributesEndpoint extends Endpoint {
    public constructor(axiosInstance: AxiosInstance) {
        super(axiosInstance);
    }

    public async createAttribute(request: CreateAttributeRequest): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.post("/api/v1/Attributes", request);
    }

    public async getAttributes(request: GetAttributesRequest): Promise<ConnectorResponse<ConnectorAttributes>> {
        return await this.get("/api/v1/Attributes", request);
    }

    public async getAttribute(attributeId: string): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.get(`/api/v1/Attributes/${attributeId}`);
    }

    public async getValidAttributes(): Promise<ConnectorResponse<ConnectorAttribute>> {
        return await this.get("/api/v1/Attributes/Valid");
    }
}
