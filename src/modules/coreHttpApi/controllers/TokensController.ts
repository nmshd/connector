import { OwnerRestriction, TransportServices } from "@nmshd/runtime";
import express from "express";
import { Inject } from "typescript-ioc";
import { Accept, Context, ContextAccept, ContextResponse, Errors, GET, Path, PathParam, POST, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController, Mimetype } from "../common/BaseController";

@Path("/api/v2/Tokens")
export class TokensController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Path("/Own")
    @Accept("application/json")
    public async createOwnToken(request: any): Promise<Return.NewResource<Envelope>> {
        request.ephemeral ??= false;
        const result = await this.transportServices.tokens.createOwnToken(request);
        return this.created(result);
    }

    @POST
    @Path("/Peer")
    @Accept("application/json")
    public async loadPeerToken(request: any): Promise<Return.NewResource<Envelope>> {
        request.ephemeral ??= false;
        const result = await this.transportServices.tokens.loadPeerToken(request);
        return this.created(result);
    }

    @GET
    @Path("/Own")
    @Accept("application/json")
    public async getOwnTokens(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.tokens.getTokens({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Own
        });
        return this.ok(result);
    }

    @GET
    @Path("/Peer")
    @Accept("application/json")
    public async getPeerTokens(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.tokens.getTokens({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Peer
        });
        return this.ok(result);
    }

    @GET
    @Path(":id")
    // do not declare an @Accept here because the combination of @Accept and @GET causes an error that is logged but the functionality is not affected
    public async getToken(@PathParam("id") id: string, @ContextAccept accept: string, @ContextResponse response: express.Response): Promise<Envelope | void> {
        switch (accept) {
            case "image/png":
                const qrCodeResult = await this.transportServices.tokens.getQRCodeForToken({ id });
                return this.file(
                    qrCodeResult,
                    (r) => r.value.qrCodeBytes,
                    () => `${id}.png`,
                    () => Mimetype.png(),
                    response,
                    200
                );

            case "application/json":
                const result = await this.transportServices.tokens.getToken({ id });
                return this.ok(result);

            default:
                throw new Errors.NotAcceptableError();
        }
    }
}
