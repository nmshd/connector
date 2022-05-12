import { ConsumptionServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Context, GET, Path, PathParam, POST, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v1/Requests/Outgoing")
export class OutgoingRequestsController extends BaseController {
    public constructor(@Inject private readonly consumptionServices: ConsumptionServices) {
        super();
    }

    @POST
    @Path("/Validate")
    public async canCreate(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.outgoingRequests.canCreate(request);
        return this.created(result);
    }

    @POST
    public async create(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.outgoingRequests.create(request);
        return this.created(result);
    }

    @GET
    @Path(":id")
    public async getRequest(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.consumptionServices.outgoingRequests.getRequest({ id });
        return this.ok(result);
    }

    @GET
    public async getRequests(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.consumptionServices.outgoingRequests.getRequests({ query: context.request.query });
        return this.ok(result);
    }
}
