import { ConsumptionServices, TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Context, GET, Path, PathParam, POST, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v1/Attributes")
export class AttributesController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices, @Inject private readonly consumptionServices: ConsumptionServices) {
        super();
    }

    @POST
    public async createAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const selfAddress = (await this.transportServices.account.getIdentityInfo()).value.address;
        if (request?.content?.owner !== selfAddress) throw new Error("You are not allowed to create an attribute that is not owned by yourself");

        const result = await this.consumptionServices.attributes.createAttribute(request);
        return this.created(result);
    }

    @GET
    public async getAttributes(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttributes({ query: context.request.query });
        return this.ok(result);
    }

    @GET
    @Path("/:id")
    public async getAttribute(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttribute({ id });
        return this.ok(result);
    }

    @GET
    @Path("/Valid")
    public async getValidAttributes(): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAllValid();
        return this.ok(result);
    }
}
