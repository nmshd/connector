import { OwnerRestriction, TransportServices } from "@nmshd/runtime";
import express from "express";
import { Inject } from "typescript-ioc";
import { Accept, Context, ContextAccept, ContextResponse, GET, Path, PathParam, POST, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController, Mimetype } from "../common/BaseController";

@Path("/api/v1/RelationshipTemplates")
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

    @Path("/Own")
    @GET
    public async getOwnTemplates(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.relationshipTemplates.getRelationshipTemplates({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Own
        });
        return this.ok(result);
    }

    @Path("/Peer")
    @GET
    public async getPeerTemplates(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.relationshipTemplates.getRelationshipTemplates({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Peer
        });
        return this.ok(result);
    }

    @Path(":id")
    @GET
    public async getRelationshipTemplate(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.relationshipTemplates.getRelationshipTemplate({ id });
        return this.ok(result);
    }

    @Path("/Own")
    @POST
    public async createOwnTemplate(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.relationshipTemplates.createOwnRelationshipTemplate(request);
        return this.created(result);
    }

    @Path("/Peer")
    @POST
    public async loadPeerTemplate(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.relationshipTemplates.loadPeerRelationshipTemplate(request);
        return this.created(result);
    }

    @Path("/Own/:id")
    @GET
    @Accept("image/png")
    public async createQrCodeForOwnTemplate(@PathParam("id") id: string, @ContextResponse response: express.Response): Promise<Return.NewResource<Envelope> | void> {
        const qrCodeResult = await this.transportServices.relationshipTemplates.createQrCodeForOwnTemplate({ templateId: id });

        return this.file(
            qrCodeResult,
            (r) => r.value.qrCodeBytes,
            () => `${id}.png`,
            () => Mimetype.png(),
            response,
            200
        );
    }

    @Path("/Own/:id/Token")
    @POST
    @Accept("application/json", "image/png")
    public async createTokenForOwnTemplate(
        @PathParam("id") id: string,
        @ContextAccept accept: string,
        @ContextResponse response: express.Response,
        request: any
    ): Promise<Return.NewResource<Envelope> | void> {
        switch (accept) {
            case "image/png":
                const qrCodeResult = await this.transportServices.relationshipTemplates.createTokenQrCodeForOwnTemplate({
                    templateId: id,
                    expiresAt: request.expiresAt
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
                    ephemeral: request.ephemeral
                });
                return this.created(jsonResult);
        }
    }
}
