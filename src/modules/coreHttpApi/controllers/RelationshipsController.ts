import { TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, DELETE, GET, Path, PathParam, POST, PUT, Return, ServiceContext } from "@nmshd/typescript-rest";
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

    @PUT
    @Path(":id/Revoke")
    @Accept("application/json")
    public async revokeRelationship(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.revokeRelationship({
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

    @PUT
    @Path(":id/Terminate")
    @Accept("application/json")
    public async terminateRelationship(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.terminateRelationship({ relationshipId: id });
        return this.ok(result);
    }

    @DELETE
    @Path(":id")
    @Accept("application/json")
    public async decomposeRelationship(@PathParam("id") id: string): Promise<void> {
        const result = await this.transportServices.relationships.decomposeRelationship({ relationshipId: id });
        return this.noContent(result);
    }

    @PUT
    @Path(":id/Reactivate")
    @Accept("application/json")
    public async requestRelationshipReactivation(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.requestRelationshipReactivation({ relationshipId: id });
        return this.ok(result);
    }

    @PUT
    @Path(":id/Reactivate/Accept")
    @Accept("application/json")
    public async acceptRelationshipReactivation(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.acceptRelationshipReactivation({ relationshipId: id });
        return this.ok(result);
    }

    @PUT
    @Path(":id/Reactivate/Reject")
    @Accept("application/json")
    public async rejectRelationshipReactivation(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.rejectRelationshipReactivation({ relationshipId: id });
        return this.ok(result);
    }

    @PUT
    @Path(":id/Reactivate/Revoke")
    @Accept("application/json")
    public async revokeRelationshipReactivation(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.revokeRelationshipReactivation({ relationshipId: id });
        return this.ok(result);
    }
}
