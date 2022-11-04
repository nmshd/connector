import {
    CanCreateOutgoingRequestRequest,
    ConnectorRequest,
    ConnectorRequests,
    ConnectorRequestValidationResult,
    ConnectorResponse,
    CreateOutgoingRequestRequest,
    GetOutgoingRequestsRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class OutgoingRequestsEndpoint extends Endpoint {
    public async canCreateRequest(request: CanCreateOutgoingRequestRequest): Promise<ConnectorResponse<ConnectorRequestValidationResult>> {
        return await this.post("/api/v2/Requests/Outgoing/Validate", request);
    }

    public async createRequest(request: CreateOutgoingRequestRequest): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.post("/api/v2/Requests/Outgoing", request);
    }

    public async getRequest(requestId: string): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.get(`/api/v2/Requests/Outgoing/${requestId}`);
    }

    public async getRequests(request: GetOutgoingRequestsRequest): Promise<ConnectorResponse<ConnectorRequests>> {
        return await this.get("/api/v2/Requests/Outgoing", request);
    }
}
