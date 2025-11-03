import { BaseController, Envelope } from "@nmshd/connector-types";
import { OwnerRestriction, RelationshipTemplateDTO, TokenDTO, TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, ContextAccept, ContextResponse, GET, POST, Path, PathParam, Return, Security, ServiceContext } from "@nmshd/typescript-rest";
import express from "express";

@Security("core:relationshipTemplates")
@Path("/api/core/v1/RelationshipTemplates")
export class RelationshipTemplatesController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @GET
    public async getTemplates(@Context context: ServiceContext): Promise<Envelope<RelationshipTemplateDTO[]>> {
        const result = await this.transportServices.relationshipTemplates.getRelationshipTemplates({
            query: context.request.query
        });
        return this.ok(result);
    }

    @GET
    @Path("/Own")
    @Accept("application/json")
    public async getOwnTemplates(@Context context: ServiceContext): Promise<Envelope<RelationshipTemplateDTO[]>> {
        const result = await this.transportServices.relationshipTemplates.getRelationshipTemplates({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Own
        });
        return this.ok(result);
    }

    @GET
    @Path("/Peer")
    @Accept("application/json")
    public async getPeerTemplates(@Context context: ServiceContext): Promise<Envelope<RelationshipTemplateDTO[]>> {
        const result = await this.transportServices.relationshipTemplates.getRelationshipTemplates({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Peer
        });
        return this.ok(result);
    }

    @GET
    @Path("/:id")
    @Accept("application/json", "image/png")
    public async getRelationshipTemplate(
        @PathParam("id") id: string,
        @ContextAccept accept: string,
        @ContextResponse response: express.Response
    ): Promise<Envelope<RelationshipTemplateDTO> | void> {
        const result = await this.transportServices.relationshipTemplates.getRelationshipTemplate({ id });

        switch (accept) {
            case "image/png":
                return await this.qrCode(result, `${id}.png`, response, 200);
            default:
                return this.ok(result);
        }
    }

    @POST
    @Path("/Own")
    @Accept("application/json")
    public async createOwnTemplate(request: any): Promise<Return.NewResource<Envelope<RelationshipTemplateDTO>>> {
        const result = await this.transportServices.relationshipTemplates.createOwnRelationshipTemplate(request);
        return this.created(result);
    }

    @POST
    @Path("/Peer")
    @Accept("application/json")
    public async loadPeerTemplate(request: any): Promise<Return.NewResource<Envelope<RelationshipTemplateDTO>>> {
        const result = await this.transportServices.relationshipTemplates.loadPeerRelationshipTemplate(request);
        return this.created(result);
    }

    @POST
    @Path("/Own/:id/Token")
    @Accept("application/json", "image/png")
    public async createTokenForOwnRelationshipTemplate(
        @PathParam("id") id: string,
        @ContextAccept accept: string,
        @ContextResponse response: express.Response,
        request: any
    ): Promise<Return.NewResource<Envelope<TokenDTO>> | void> {
        const result = await this.transportServices.relationshipTemplates.createTokenForOwnRelationshipTemplate({
            templateId: id,
            expiresAt: request.expiresAt,
            ephemeral: accept === "image/png" || request.ephemeral,
            forIdentity: request.forIdentity,
            passwordProtection: request.passwordProtection
        });

        switch (accept) {
            case "image/png":
                return await this.qrCode(result, `${id}.png`, response, 201);
            default:
                return this.created(result);
        }
    }
}
