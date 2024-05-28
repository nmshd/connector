import { TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Accept, Context, GET, Path, PathParam, POST, PUT, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/Relationships")
export class RelationshipsController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Accept("application/json")
    public async createRelationship(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.relationships.createRelationship(request);
        return this.created(result);
    }

    @PUT
    @Path(":id/Accept")
    @Accept("application/json")
    public async acceptRelationship(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.acceptRelationship({
            relationshipId: id
        });
        return this.ok(result);
    }

    @PUT
    @Path(":id/Reject")
    @Accept("application/json")
    public async rejectRelationship(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.rejectRelationship({
            relationshipId: id
        });
        return this.ok(result);
    }

    @GET
    @Accept("application/json")
    public async getRelationships(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.relationships.getRelationships({
            query: context.request.query
        });
        return this.ok(result);
    }

    @GET
    @Path(":id")
    @Accept("application/json")
    public async getRelationship(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.getRelationship({ id });
        return this.ok(result);
    }

    @GET
    @Path(":id/Attributes")
    @Accept("application/json")
    public async getAttributesForRelationship(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.getAttributesForRelationship({ id });
        return this.ok(result);
    }
}
