import {
    CanCreateOutgoingRequestRequest,
    ConnectorHttpResponse,
    ConnectorRequest,
    ConnectorRequests,
    ConnectorRequestValidationResult,
    CreateOutgoingRequestRequest,
    GetOutgoingRequestsRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class OutgoingRequestsEndpoint extends Endpoint {
    public async canCreateRequest(request: CanCreateOutgoingRequestRequest): Promise<ConnectorHttpResponse<ConnectorRequestValidationResult>> {
        return await this.post("/api/v2/Requests/Outgoing/Validate", request);
    }

    public async createRequest(request: CreateOutgoingRequestRequest): Promise<ConnectorHttpResponse<ConnectorRequest>> {
        return await this.post("/api/v2/Requests/Outgoing", request);
    }

    public async getRequest(requestId: string): Promise<ConnectorHttpResponse<ConnectorRequest>> {
        return await this.get(`/api/v2/Requests/Outgoing/${requestId}`);
    }

    public async getRequests(request: GetOutgoingRequestsRequest): Promise<ConnectorHttpResponse<ConnectorRequests>> {
        return await this.get("/api/v2/Requests/Outgoing", request);
    }
}
