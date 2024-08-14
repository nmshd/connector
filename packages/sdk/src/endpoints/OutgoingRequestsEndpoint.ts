import {
    CanCreateOutgoingRequestRequest,
    ConnectorRequest,
    ConnectorRequests,
    ConnectorRequestValidationResult,
    CreateOutgoingRequestRequest,
    GetOutgoingRequestsRequest,
    Response
} from "../types";
import { Endpoint } from "./Endpoint";

export class OutgoingRequestsEndpoint extends Endpoint {
    public async canCreateRequest(request: CanCreateOutgoingRequestRequest): Promise<Response<ConnectorRequestValidationResult>> {
        return await this.post("/api/v2/Requests/Outgoing/Validate", request);
    }

    public async createRequest(request: CreateOutgoingRequestRequest): Promise<Response<ConnectorRequest>> {
        return await this.post("/api/v2/Requests/Outgoing", request);
    }

    public async getRequest(requestId: string): Promise<Response<ConnectorRequest>> {
        return await this.get(`/api/v2/Requests/Outgoing/${requestId}`);
    }

    public async getRequests(request: GetOutgoingRequestsRequest): Promise<Response<ConnectorRequests>> {
        return await this.get("/api/v2/Requests/Outgoing", request);
    }
}
