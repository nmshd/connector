import { BaseController, Envelope, Mimetype } from "@nmshd/connector-types";
import { OwnerRestriction, TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, ContextAccept, ContextResponse, GET, POST, Path, PathParam, Return, ServiceContext } from "@nmshd/typescript-rest";
import express from "express";

@Path("/api/v2/RelationshipTemplates")
export class RelationshipTemplatesController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @GET
    public async getTemplates(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.relationshipTemplates.getRelationshipTemplates({
            query: context.request.query
        });
        return this.ok(result);
    }

    @GET
    @Path("/Own")
    @Accept("application/json")
    public async getOwnTemplates(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.relationshipTemplates.getRelationshipTemplates({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Own
        });
        return this.ok(result);
    }

    @GET
    @Path("/Peer")
    @Accept("application/json")
    public async getPeerTemplates(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.relationshipTemplates.getRelationshipTemplates({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Peer
        });
        return this.ok(result);
    }

    @GET
    @Path(":id")
    @Accept("application/json", "image/png")
    public async getRelationshipTemplate(@PathParam("id") id: string, @ContextAccept accept: string, @ContextResponse response: express.Response): Promise<Envelope | void> {
        switch (accept) {
            case "image/png":
                const qrCodeResult = await this.transportServices.relationshipTemplates.createQRCodeForOwnTemplate({ templateId: id });

                return this.file(
                    qrCodeResult,
                    (r) => r.value.qrCodeBytes,
                    () => `${id}.png`,
                    () => Mimetype.png(),
                    response,
                    200
                );

            default:
                const result = await this.transportServices.relationshipTemplates.getRelationshipTemplate({ id });
                return this.ok(result);
        }
    }

    @POST
    @Path("/Own")
    @Accept("application/json")
    public async createOwnTemplate(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.relationshipTemplates.createOwnRelationshipTemplate(request);
        return this.created(result);
    }

    @POST
    @Path("/Peer")
    @Accept("application/json")
    public async loadPeerTemplate(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.relationshipTemplates.loadPeerRelationshipTemplate(request);
        return this.created(result);
    }

    @POST
    @Path("/Own/:id/Token")
    @Accept("application/json", "image/png")
    public async createTokenForOwnTemplate(
        @PathParam("id") id: string,
        @ContextAccept accept: string,
        @ContextResponse response: express.Response,
        request: any
    ): Promise<Return.NewResource<Envelope> | void> {
        switch (accept) {
            case "image/png":
                const qrCodeResult = await this.transportServices.relationshipTemplates.createTokenQRCodeForOwnTemplate({
                    templateId: id,
                    expiresAt: request.expiresAt,
                    forIdentity: request.forIdentity,
                    passwordProtection: request.passwordProtection
                });
                return this.file(
                    qrCodeResult,
                    (r) => r.value.qrCodeBytes,
                    () => `${id}.png`,
                    () => Mimetype.png(),
                    response,
                    201
                );
            default:
                const jsonResult = await this.transportServices.relationshipTemplates.createTokenForOwnTemplate({
                    templateId: id,
                    expiresAt: request.expiresAt,
                    ephemeral: request.ephemeral,
                    forIdentity: request.forIdentity,
                    passwordProtection: request.passwordProtection
                });
                return this.created(jsonResult);
        }
    }
}
