import {
    AcceptIncomingRequestRequest,
    CanAcceptIncomingRequestRequest,
    CanRejectIncomingRequestRequest,
    ConnectorHttpResponse,
    ConnectorRequest,
    ConnectorRequests,
    ConnectorRequestValidationResult,
    GetIncomingRequestsRequest,
    RejectIncomingRequestRequest
} from "../types";
import { CorrelationID, Endpoint } from "./Endpoint";

export class IncomingRequestsEndpoint extends Endpoint {
    public async canAccept(
        requestId: string,
        request: CanAcceptIncomingRequestRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorRequestValidationResult>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/CanAccept`, request, correlationId);
    }

    public async accept(requestId: string, request: AcceptIncomingRequestRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRequest>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/Accept`, request, correlationId);
    }

    public async canReject(
        requestId: string,
        request: CanRejectIncomingRequestRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorRequestValidationResult>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/CanReject`, request, correlationId);
    }

    public async reject(requestId: string, request: RejectIncomingRequestRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRequest>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/Reject`, request, correlationId);
    }

    public async getRequest(requestId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRequest>> {
        return await this.get(`/api/v2/Requests/Incoming/${requestId}`, undefined, correlationId);
    }

    public async getRequests(request: GetIncomingRequestsRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRequests>> {
        return await this.get("/api/v2/Requests/Incoming", request, correlationId);
    }
}
