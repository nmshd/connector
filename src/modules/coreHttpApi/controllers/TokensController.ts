import { OwnerRestriction, TransportServices } from "@nmshd/runtime";
import express from "express";
import { Inject } from "typescript-ioc";
import { Accept, Context, ContextAccept, ContextResponse, GET, Path, PathParam, POST, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController, Mimetype } from "../common/BaseController";

@Path("/api/v1/Tokens")
export class TokensController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @Path("/Own")
    @POST
    public async createOwnToken(request: any): Promise<Return.NewResource<Envelope>> {
        request.ephemeral ??= false;
        const result = await this.transportServices.tokens.createOwnToken(request);
        return this.created(result);
    }

    @Path("/Peer")
    @POST
    public async loadPeerToken(request: any): Promise<Return.NewResource<Envelope>> {
        request.ephemeral ??= false;
        const result = await this.transportServices.tokens.loadPeerToken(request);
        return this.created(result);
    }

    @Path("/Own")
    @GET
    public async getOwnTokens(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.tokens.getTokens({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Own
        });
        return this.ok(result);
    }

    @Path("/Peer")
    @GET
    public async getPeerTokens(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.tokens.getTokens({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Peer
        });
        return this.ok(result);
    }

    @Path(":id")
    @GET
    @Accept("application/json", "image/png")
    public async getToken(@PathParam("id") id: string, @ContextAccept accept: string, @ContextResponse response: express.Response): Promise<Envelope | void> {
        if (accept === "image/png") {
            const result = await this.transportServices.tokens.getQRCodeForToken({ id });

            return this.file(
                result,
                (r) => r.value.qrCodeBytes,
                () => `${id}.png`,
                () => Mimetype.png(),
                response,
                200
            );
        }

        const result = await this.transportServices.tokens.getToken({ id });
        return this.ok(result);
    }
}
