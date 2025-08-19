import { BaseController, Envelope } from "@nmshd/connector-types";
import { TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, DELETE, GET, Path, POST, QueryParam, Security } from "@nmshd/typescript-rest";

@Security("debug:identityDeletionProcess")
@Path("/api/core/v1/IdentityDeletionProcess")
export class IdentityDeletionProcessController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Accept("application/json")
    public async initiateIdentityDeletionProcess(@QueryParam("lengthOfGracePeriodInDays") lengthOfGracePeriodInDays?: number): Promise<Envelope> {
        const result = await this.transportServices.identityDeletionProcesses.initiateIdentityDeletionProcess({ lengthOfGracePeriodInDays });
        return this.ok(result);
    }

    @GET
    @Accept("application/json")
    public async getActiveIdentityDeletionProcess(): Promise<Envelope> {
        const result = await this.transportServices.identityDeletionProcesses.getActiveIdentityDeletionProcess();
        return this.ok(result);
    }

    @DELETE
    @Accept("application/json")
    public async cancelIdentityDeletionProcess(): Promise<Envelope> {
        const result = await this.transportServices.identityDeletionProcesses.cancelIdentityDeletionProcess();
        return this.ok(result);
    }
}
