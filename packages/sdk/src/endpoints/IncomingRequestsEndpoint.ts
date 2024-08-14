import {
    AcceptIncomingRequestRequest,
    CanAcceptIncomingRequestRequest,
    CanRejectIncomingRequestRequest,
    ConnectorRequest,
    ConnectorRequests,
    ConnectorRequestValidationResult,
    GetIncomingRequestsRequest,
    RejectIncomingRequestRequest,
    Response
} from "../types";
import { Endpoint } from "./Endpoint";

export class IncomingRequestsEndpoint extends Endpoint {
    public async canAccept(requestId: string, request: CanAcceptIncomingRequestRequest): Promise<Response<ConnectorRequestValidationResult>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/CanAccept`, request);
    }

    public async accept(requestId: string, request: AcceptIncomingRequestRequest): Promise<Response<ConnectorRequest>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/Accept`, request);
    }

    public async canReject(requestId: string, request: CanRejectIncomingRequestRequest): Promise<Response<ConnectorRequestValidationResult>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/CanReject`, request);
    }

    public async reject(requestId: string, request: RejectIncomingRequestRequest): Promise<Response<ConnectorRequest>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/Reject`, request);
    }

    public async getRequest(requestId: string): Promise<Response<ConnectorRequest>> {
        return await this.get(`/api/v2/Requests/Incoming/${requestId}`);
    }

    public async getRequests(request: GetIncomingRequestsRequest): Promise<Response<ConnectorRequests>> {
        return await this.get("/api/v2/Requests/Incoming", request);
    }
}
