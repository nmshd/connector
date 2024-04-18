import { AcceptIncomingRequestRequest as AcceptIncomingRequestRequestNew } from "@nmshd/runtime";
import {
    AcceptIncomingRequestRequest as AcceptIncomingRequestRequestOld,
    CanAcceptIncomingRequestRequest,
    CanRejectIncomingRequestRequest,
    ConnectorRequest,
    ConnectorRequests,
    ConnectorRequestValidationResult,
    ConnectorResponse,
    GetIncomingRequestsRequest,
    RejectIncomingRequestRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class IncomingRequestsEndpoint extends Endpoint {
    public async canAccept(requestId: string, request: CanAcceptIncomingRequestRequest): Promise<ConnectorResponse<ConnectorRequestValidationResult>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/CanAccept`, request);
    }

    public async accept(requestId: string, request: Omit<AcceptIncomingRequestRequestNew, "requestId">): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/Accept`, request);
    }
    public async acceptold(requestId: string, request: AcceptIncomingRequestRequestOld): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/Accept`, request);
    }

    public async canReject(requestId: string, request: CanRejectIncomingRequestRequest): Promise<ConnectorResponse<ConnectorRequestValidationResult>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/CanReject`, request);
    }

    public async reject(requestId: string, request: RejectIncomingRequestRequest): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.put(`/api/v2/Requests/Incoming/${requestId}/Reject`, request);
    }

    public async getRequest(requestId: string): Promise<ConnectorResponse<ConnectorRequest>> {
        return await this.get(`/api/v2/Requests/Incoming/${requestId}`);
    }

    public async getRequests(request: GetIncomingRequestsRequest): Promise<ConnectorResponse<ConnectorRequests>> {
        return await this.get("/api/v2/Requests/Incoming", request);
    }
}
