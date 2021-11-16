import { TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { GET, Path, POST } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v1/Account")
export class AccountController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @GET
    @Path("/IdentityInfo")
    public async getIdentityInfo(): Promise<Envelope> {
        const result = await this.transportServices.account.getIdentityInfo();
        return this.ok(result);
    }

    @POST
    @Path("/Sync")
    public async sync(): Promise<Envelope> {
        const result = await this.transportServices.account.syncEverything();
        return this.ok(result);
    }

    @GET
    @Path("/SyncInfo")
    public async getSyncInfo(): Promise<Envelope> {
        const result = await this.transportServices.account.getSyncInfo();
        return this.ok(result);
    }
}
