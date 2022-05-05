import { ConsumptionServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Context, GET, Path, PathParam, PUT, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v1/Requests/Incoming")
export class IncomingRequestsController extends BaseController {
    public constructor(@Inject private readonly consumptionServices: ConsumptionServices) {
        super();
    }

    @PUT
    @Path(":id/CanAccept")
    public async canAccept(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.canAccept({ ...request, requestId });
        return this.ok(result);
    }

    @PUT
    @Path(":id/Accept")
    public async accept(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.accept({ ...request, requestId });
        return this.ok(result);
    }

    @PUT
    @Path(":id/CanReject")
    public async canReject(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.canReject({ ...request, requestId });
        return this.ok(result);
    }

    @PUT
    @Path(":id/Reject")
    public async reject(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.reject({ ...request, requestId });
        return this.ok(result);
    }

    @GET
    @Path(":id")
    public async getRequest(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.getRequest({ id });
        return this.ok(result);
    }

    @GET
    public async getRequests(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.consumptionServices.incomingRequests.getRequests({ query: context.request.query });
        return this.ok(result);
    }
}
