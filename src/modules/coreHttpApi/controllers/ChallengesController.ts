import { TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Accept, Path, POST, Return } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/Challenges")
export class ChallengesController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Accept("application/json")
    public async createChallenge(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.challenges.createChallenge(request);
        return this.created(result);
    }

    @POST
    @Path("/Validate")
    @Accept("application/json")
    public async validateChallenge(request: any): Promise<Envelope> {
        const result = await this.transportServices.challenges.validateChallenge(request);
        return this.ok(result);
    }
}
