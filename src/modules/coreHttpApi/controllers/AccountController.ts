import { Envelope } from "@nmshd/connector-types";
import { TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, GET, Path, POST } from "@nmshd/typescript-rest";
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
    public async sync(): Promise<void> {
        const result = await this.transportServices.account.syncEverything();
        if (result.isError) throw result.error;
        return this.noContent(result);
    }

    @GET
    @Path("/SyncInfo")
    @Accept("application/json")
    public async getSyncInfo(): Promise<Envelope> {
        const result = await this.transportServices.account.getSyncInfo();
        return this.ok(result);
    }
}
