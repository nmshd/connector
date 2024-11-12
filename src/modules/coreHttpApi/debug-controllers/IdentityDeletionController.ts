import { TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, GET, Path, POST } from "@nmshd/typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/IdentityDeletionProcess")
export class IdentityDeletionProcessController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Path("/")
    @Accept("application/json")
    public async initiateIdentityDeletionProcess(): Promise<Envelope> {
        const result = await this.transportServices.identityDeletionProcesses.initiateIdentityDeletionProcess();
        return this.ok(result);
    }

    @GET
    @Path("/")
    @Accept("application/json")
    public async getActiveIdentityDeletionProcess(): Promise<Envelope> {
        const result = await this.transportServices.identityDeletionProcesses.getActiveIdentityDeletionProcess();
        return this.ok(result);
    }

    @POST
    @Path("/cancel")
    @Accept("application/json")
    public async cancelIdentityDeletionProcess(): Promise<Envelope> {
        const result = await this.transportServices.identityDeletionProcesses.cancelIdentityDeletionProcess();
        return this.ok(result);
    }
}
