import { Envelope } from "@nmshd/connector";
import { ConsumptionServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, DELETE, GET, PUT, Path, QueryParam } from "@nmshd/typescript-rest";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/IdentityMetadata")
export class IdentityMetadataController extends BaseController {
    public constructor(@Inject private readonly consumptionServices: ConsumptionServices) {
        super();
    }

    @PUT
    @Accept("application/json")
    public async upsertIdentityMetadata(request: any): Promise<Envelope> {
        const result = await this.consumptionServices.identityMetadata.upsertIdentityMetadata(request);
        return this.ok(result);
    }

    @GET
    public async getIdentityMetadata(@QueryParam("reference") reference: string, @QueryParam("key") key?: string): Promise<Envelope> {
        const result = await this.consumptionServices.identityMetadata.getIdentityMetadata({ reference, key });
        return this.ok(result);
    }

    @DELETE
    public async deleteIdentityMetadata(@QueryParam("reference") reference: string, @QueryParam("key") key?: string): Promise<void> {
        const result = await this.consumptionServices.identityMetadata.deleteIdentityMetadata({ reference, key });
        return this.noContent(result);
    }
}
