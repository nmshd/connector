import { ApplicationError } from "@js-soft/ts-utils";
import { BaseController, Envelope } from "@nmshd/connector-types";
import { ConsumptionServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, GET, Path, PathParam, PUT, Security, ServiceContext } from "@nmshd/typescript-rest";

@Security(["core:requests", "core:requests:incoming"])
@Path("/api/core/v1/Requests/Incoming")
export class IncomingRequestsController extends BaseController {
    public constructor(@Inject private readonly consumptionServices: ConsumptionServices) {
        super();
    }

    @PUT
    @Path("/:id/CanAccept")
    @Accept("application/json")
    public async canAccept(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        if (request?.decidedByAutomation === true) {
            throw new ApplicationError("error.connector.incomingRequests.decidedByAutomation", "Decided by automation is not allowed for this endpoint.");
        }

        const result = await this.consumptionServices.incomingRequests.canAccept({ ...request, requestId });
        return this.ok(result);
    }

    @PUT
    @Path("/:id/Accept")
    @Accept("application/json")
    public async accept(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        if (request?.decidedByAutomation === true) {
            throw new ApplicationError("error.connector.incomingRequests.decidedByAutomation", "Decided by automation is not allowed for this endpoint.");
        }

        const result = await this.consumptionServices.incomingRequests.accept({ ...request, requestId });
        return this.ok(result);
    }

    @PUT
    @Path("/:id/CanReject")
    @Accept("application/json")
    public async canReject(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        if (request?.decidedByAutomation === true) {
            throw new ApplicationError("error.connector.incomingRequests.decidedByAutomation", "Decided by automation is not allowed for this endpoint.");
        }

        const result = await this.consumptionServices.incomingRequests.canReject({ ...request, requestId });
        return this.ok(result);
    }

    @PUT
    @Path("/:id/Reject")
    @Accept("application/json")
    public async reject(@PathParam("id") requestId: string, request: any): Promise<Envelope> {
        if (request?.decidedByAutomation === true) {
            throw new ApplicationError("error.connector.incomingRequests.decidedByAutomation", "Decided by automation is not allowed for this endpoint.");
        }

        const result = await this.consumptionServices.incomingRequests.reject({ ...request, requestId });
        return this.ok(result);
    }

    @GET
    @Path("/:id")
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
