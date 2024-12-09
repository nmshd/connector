import {
    CanCreateOutgoingRequestRequest,
    ConnectorHttpResponse,
    ConnectorRequest,
    ConnectorRequests,
    ConnectorRequestValidationResult,
    CreateOutgoingRequestRequest,
    GetOutgoingRequestsRequest
} from "../types";
import { CorrelationID, Endpoint } from "./Endpoint";

export class OutgoingRequestsEndpoint extends Endpoint {
    public async canCreateRequest(request: CanCreateOutgoingRequestRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRequestValidationResult>> {
        return await this.post("/api/v2/Requests/Outgoing/Validate", request, undefined, undefined, correlationId);
    }

    public async createRequest(request: CreateOutgoingRequestRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRequest>> {
        return await this.post("/api/v2/Requests/Outgoing", request, undefined, undefined, correlationId);
    }

    public async getRequest(requestId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRequest>> {
        return await this.get(`/api/v2/Requests/Outgoing/${requestId}`, undefined, correlationId);
    }

    public async getRequests(request: GetOutgoingRequestsRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRequests>> {
        return await this.get("/api/v2/Requests/Outgoing", request, correlationId);
    }
}
