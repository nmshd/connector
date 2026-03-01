import { BaseController, Envelope } from "@nmshd/connector-types";
import { ChallengeDTO, TransportServices, ValidateChallengeResponse } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Path, POST, Return, Security } from "@nmshd/typescript-rest";

@Security("core:challenges")
@Path("/api/core/v1/Challenges")
export class ChallengesController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Accept("application/json")
    public async createChallenge(request: any): Promise<Return.NewResource<Envelope<ChallengeDTO>>> {
        const result = await this.transportServices.challenges.createChallenge(request);
        return this.created(result);
    }

    @POST
    @Path("/Validate")
    @Accept("application/json")
    public async validateChallenge(request: any): Promise<Envelope<ValidateChallengeResponse>> {
        const result = await this.transportServices.challenges.validateChallenge(request);
        return this.ok(result);
    }
}
