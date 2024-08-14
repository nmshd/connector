import { ConnectorChallenge, ConnectorChallengeValidationResult, CreateChallengeRequest, Response, ValidateChallengeRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class ChallengesEndpoint extends Endpoint {
    public async createChallenge(request: CreateChallengeRequest): Promise<Response<ConnectorChallenge>> {
        return await this.post("/api/v2/Challenges", request);
    }

    public async validateChallenge(request: ValidateChallengeRequest): Promise<Response<ConnectorChallengeValidationResult>> {
        return await this.post("/api/v2/Challenges/Validate", request, 200);
    }
}
