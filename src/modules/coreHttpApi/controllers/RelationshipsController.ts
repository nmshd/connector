import { TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Context, GET, Path, PathParam, POST, PUT, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

class RelationshipChangeAnswer {
    public content: any;
}

@Path("/api/v1/Relationships")
export class RelationshipsController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    public async createRelationship(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.relationships.createRelationship(request);
        return this.created(result);
    }

    @POST
    @Path("/Relationships/:id/Changes")
    public async createRelationshipChange(@PathParam("id") id: string): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.relationships.createRelationshipChange({ id });
        return this.created(result);
    }

    @PUT
    @Path(":id/Changes/:changeId/Accept")
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
    public async rejectRelationshipChange(@PathParam("id") id: string, @PathParam("changeId") changeId: string, body?: RelationshipChangeAnswer): Promise<Envelope> {
        const result = await this.transportServices.relationships.rejectRelationshipChange({
            relationshipId: id,
            changeId,
            content: body?.content
        });
        return this.ok(result);
    }

    @PUT
    @Path(":id/Changes/:changeId/Revoke")
    public async revokeRelationshipChange(@PathParam("id") id: string, @PathParam("changeId") changeId: string, body?: RelationshipChangeAnswer): Promise<Envelope> {
        const result = await this.transportServices.relationships.revokeRelationshipChange({
            relationshipId: id,
            changeId,
            content: body?.content
        });
        return this.ok(result);
    }

    @GET
    public async getRelationships(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.relationships.getRelationships({
            query: context.request.query
        });
        return this.ok(result);
    }

    @GET
    @Path(":id")
    public async getRelationship(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationships.getRelationship({ id });
        return this.ok(result);
    }
}
