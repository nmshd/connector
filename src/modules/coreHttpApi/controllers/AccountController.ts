import { TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Accept, GET, Path, POST } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/Account")
export class AccountController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @GET
    @Path("/IdentityInfo")
    @Accept("application/json")
    public async getIdentityInfo(): Promise<Envelope> {
        const result = await this.transportServices.account.getIdentityInfo();
        return this.ok(result);
    }

    @POST
    @Path("/Sync")
    @Accept("application/json")
    public async sync(): Promise<Envelope> {
        const result = await this.transportServices.account.syncEverything();
        return this.ok(result);
    }

    @GET
    @Path("/SyncInfo")
    @Accept("application/json")
    public async getSyncInfo(): Promise<Envelope> {
        const result = await this.transportServices.account.getSyncInfo();
        return this.ok(result);
    }
}
