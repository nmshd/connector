import { ChallengeDTO } from "@nmshd/runtime-types";
import { ConnectorChallengeValidationResult, ConnectorHttpResponse, CreateChallengeRequest, ValidateChallengeRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class ChallengesEndpoint extends Endpoint {
    public async createChallenge(request: CreateChallengeRequest): Promise<ConnectorHttpResponse<ChallengeDTO>> {
        return await this.post("/api/core/v1/Challenges", request);
    }

    public async validateChallenge(request: ValidateChallengeRequest): Promise<ConnectorHttpResponse<ConnectorChallengeValidationResult>> {
        return await this.post("/api/core/v1/Challenges/Validate", request, 200);
    }
}
