import { AxiosInstance } from "axios";
import { ConnectorChallenge, ConnectorChallengeValidation, ConnectorResponse, CreateChallengeRequest, ValidateChallengeRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class ChallengesEndpoint extends Endpoint {
    public constructor(axiosInstance: AxiosInstance) {
        super(axiosInstance);
    }

    public async createChallenge(request: CreateChallengeRequest): Promise<ConnectorResponse<ConnectorChallenge>> {
        return await this.post("/api/v1/Challenges", request);
    }

    public async validateChallenge(request: ValidateChallengeRequest): Promise<ConnectorResponse<ConnectorChallengeValidation>> {
        return await this.post("/api/v1/Challenges/Validate", request);
    }
}
