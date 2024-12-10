import { ConnectorChallenge, ConnectorChallengeValidationResult, ConnectorHttpResponse, CreateChallengeRequest, ValidateChallengeRequest } from "../types";
import { CorrelationID, Endpoint } from "./Endpoint";

export class ChallengesEndpoint extends Endpoint {
    public async createChallenge(request: CreateChallengeRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorChallenge>> {
        return await this.post("/api/v2/Challenges", request, undefined, undefined, correlationId);
    }

    public async validateChallenge(request: ValidateChallengeRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorChallengeValidationResult>> {
        return await this.post("/api/v2/Challenges/Validate", request, 200, undefined, correlationId);
    }
}
