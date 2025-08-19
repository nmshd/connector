import { LocalRequestDTO } from "@nmshd/runtime-types";
import { CanCreateOutgoingRequestRequest, ConnectorHttpResponse, ConnectorRequestValidationResult, CreateOutgoingRequestRequest, GetOutgoingRequestsRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class OutgoingRequestsEndpoint extends Endpoint {
    public async canCreateRequest(request: CanCreateOutgoingRequestRequest): Promise<ConnectorHttpResponse<ConnectorRequestValidationResult>> {
        return await this.post("/api/core/v1/Requests/Outgoing/Validate", request);
    }

    public async createRequest(request: CreateOutgoingRequestRequest): Promise<ConnectorHttpResponse<LocalRequestDTO>> {
        return await this.post("/api/core/v1/Requests/Outgoing", request);
    }

    public async getRequest(requestId: string): Promise<ConnectorHttpResponse<LocalRequestDTO>> {
        return await this.get(`/api/core/v1/Requests/Outgoing/${requestId}`);
    }

    public async getRequests(request: GetOutgoingRequestsRequest): Promise<ConnectorHttpResponse<LocalRequestDTO[]>> {
        return await this.get("/api/core/v1/Requests/Outgoing", request);
    }
}
