import { BaseController, Envelope, HttpServerRole } from "@nmshd/connector-types";
import { ConsumptionServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, GET, Path, PathParam, POST, Return, Security, ServiceContext } from "@nmshd/typescript-rest";

@Security([HttpServerRole.ADMIN, "core:*", "core:requests:*", "core:requests:outgoing"])
@Path("/api/v2/Requests/Outgoing")
export class OutgoingRequestsController extends BaseController {
    public constructor(@Inject private readonly consumptionServices: ConsumptionServices) {
        super();
    }

    @POST
    @Path("/Validate")
    @Accept("application/json")
    public async canCreate(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.outgoingRequests.canCreate(request);
        return this.created(result);
    }

    @POST
    @Accept("application/json")
    public async create(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.outgoingRequests.create(request);
        return this.created(result);
    }

    @GET
    @Path("/:id")
    @Accept("application/json")
    public async getRequest(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.consumptionServices.outgoingRequests.getRequest({ id });
        return this.ok(result);
    }

    @GET
    @Accept("application/json")
    public async getRequests(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.consumptionServices.outgoingRequests.getRequests({ query: context.request.query });
        return this.ok(result);
    }
}
