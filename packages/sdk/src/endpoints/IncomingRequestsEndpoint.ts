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
import { Endpoint } from "./Endpoint";

export class IncomingRequestsEndpoint extends Endpoint {
    public async canAccept(requestId: string, request: CanAcceptIncomingRequestRequest): Promise<ConnectorHttpResponse<ConnectorRequestValidationResult>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/CanAccept`, request);
    }

    public async accept(requestId: string, request: AcceptIncomingRequestRequest): Promise<ConnectorHttpResponse<ConnectorRequest>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/Accept`, request);
    }

    public async canReject(requestId: string, request: CanRejectIncomingRequestRequest): Promise<ConnectorHttpResponse<ConnectorRequestValidationResult>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/CanReject`, request);
    }

    public async reject(requestId: string, request: RejectIncomingRequestRequest): Promise<ConnectorHttpResponse<ConnectorRequest>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/Reject`, request);
    }

    public async getRequest(requestId: string): Promise<ConnectorHttpResponse<ConnectorRequest>> {
        return await this.get(`/api/v2/Requests/Incoming/${requestId}`);
    }

    public async getRequests(request: GetIncomingRequestsRequest): Promise<ConnectorHttpResponse<ConnectorRequests>> {
        return await this.get("/api/v2/Requests/Incoming", request);
    }
}
