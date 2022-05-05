import { AxiosInstance } from "axios";
import { CanCreateOutgoingRequestRequest, ConnectorRequest, ConnectorRequests, ConnectorResponse, CreateOutgoingRequestRequest, GetOutgoingRequestsRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class OutgoingRequestsEndpoint extends Endpoint {
    public constructor(axiosInstance: AxiosInstance) {
        super(axiosInstance);
    }

    public async canCreateRequest(request: CanCreateOutgoingRequestRequest): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.post("/api/v1/Requests/Outgoing/Validate", request);
    }

    public async createRequest(request: CreateOutgoingRequestRequest): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.post("/api/v1/Requests/Outgoing", request);
    }

    public async getRequest(requestId: string): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.get(`/api/v1/Requests/Outgoing/${requestId}`);
    }

    public async getRequests(request: GetOutgoingRequestsRequest): Promise<ConnectorResponse<ConnectorRequests>> {
        return await this.get("/api/v1/Requests/Outgoing", request);
    }
}
