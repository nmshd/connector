import { TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, DELETE, Path, ServiceContext } from "@nmshd/typescript-rest";
import { Envelope } from "../../../infrastructure";
import { RouteNotFoundError } from "../../../infrastructure/httpServer/middlewares/genericErrorHandler";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/IdentityDeletion")
export class IdentityDeletionController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @DELETE
    @Path("/")
    @Accept("application/json")
    public async getIdentityInfo(@Context context: ServiceContext): Promise<Envelope> {
        if (!context.request._debugMode) {
            throw new RouteNotFoundError();
        }
        const result = await this.transportServices.identityDeletionProcesses.initiateIdentityDeletionProcess();
        return this.ok(result);
    }
}
