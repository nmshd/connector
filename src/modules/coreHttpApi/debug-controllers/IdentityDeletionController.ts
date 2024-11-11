import { TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, DELETE, Path } from "@nmshd/typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/IdentityDeletion")
export class IdentityDeletionController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @DELETE
    @Path("/")
    @Accept("application/json")
    public async getIdentityInfo(): Promise<Envelope> {
        const result = await this.transportServices.identityDeletionProcesses.initiateIdentityDeletionProcess();
        return this.ok(result);
    }
}
