import { TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Accept, Context, GET, Path, PathParam, POST, PUT, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

class RelationshipChangeAnswer {
    public content: any;
}

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
    @Path(":id/Changes/:changeId/Accept")
    @Accept("application/json")
    public async acceptRelationshipChange(@PathParam("id") id: string, @PathParam("changeId") changeId: string, body?: RelationshipChangeAnswer): Promise<Envelope> {
        const result = await this.transportServices.relationships.acceptRelationshipChange({
            relationshipId: id,
            changeId,
            content: body?.content
        });
        return this.ok(result);
    }

    @PUT
    @Path(":id/Changes/:changeId/Reject")
    @Accept("application/json")
    public async rejectRelationshipChange(@PathParam("id") id: string, @PathParam("changeId") changeId: string, body?: RelationshipChangeAnswer): Promise<Envelope> {
        const result = await this.transportServices.relationships.rejectRelationshipChange({
            relationshipId: id,
            changeId,
            content: body?.content
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
