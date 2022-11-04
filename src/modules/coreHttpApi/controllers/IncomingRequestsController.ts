import { ConsumptionServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Accept, Context, GET, Path, PathParam, PUT, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/Requests/Incoming")
export class IncomingRequestsController extends BaseController {
    public constructor(@Inject private readonly consumptionServices: ConsumptionServices) {
        super();
    }

    @PUT
    @Path(":id/CanAccept")
    @Accept("application/json")
    public async canAccept(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.canAccept({ ...request, requestId });
        return this.ok(result);
    }

    @PUT
    @Path(":id/Accept")
    @Accept("application/json")
    public async accept(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.accept({ ...request, requestId });
        return this.ok(result);
    }

    @PUT
    @Path(":id/CanReject")
    @Accept("application/json")
    public async canReject(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.canReject({ ...request, requestId });
        return this.ok(result);
    }

    @PUT
    @Path(":id/Reject")
    @Accept("application/json")
    public async reject(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.reject({ ...request, requestId });
        return this.ok(result);
    }

    @GET
    @Path(":id")
    @Accept("application/json")
    public async getRequest(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.getRequest({ id });
        return this.ok(result);
    }

    @GET
    @Accept("application/json")
    public async getRequests(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.getRequests({ query: context.request.query });
        return this.ok(result);
    }
}
