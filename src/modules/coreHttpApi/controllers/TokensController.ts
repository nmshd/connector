import { BaseController, Envelope, HttpServerRole, QRCode } from "@nmshd/connector-types";
import { OwnerRestriction, TokenDTO, TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, ContextAccept, ContextResponse, GET, Path, PathParam, POST, QueryParam, Return, Security, ServiceContext } from "@nmshd/typescript-rest";
import express from "express";

@Security([HttpServerRole.ADMIN, "core:*", "core:tokens"])
@Path("/api/v2/Tokens")
export class TokensController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Path("/Own")
    @Accept("application/json")
    public async createOwnToken(request: any): Promise<Return.NewResource<Envelope<TokenDTO>>> {
        request.ephemeral ??= false;
        const result = await this.transportServices.tokens.createOwnToken(request);
        return this.created(result);
    }

    @POST
    @Path("/Peer")
    @Accept("application/json")
    public async loadPeerToken(request: any): Promise<Return.NewResource<Envelope<TokenDTO>>> {
        request.ephemeral ??= false;
        const result = await this.transportServices.tokens.loadPeerToken(request);
        return this.created(result);
    }

    @GET
    @Path("/Own")
    @Accept("application/json")
    public async getOwnTokens(@Context context: ServiceContext): Promise<Envelope<TokenDTO[]>> {
        const result = await this.transportServices.tokens.getTokens({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Own
        });
        return this.ok(result);
    }

    @GET
    @Path("/Peer")
    @Accept("application/json")
    public async getPeerTokens(@Context context: ServiceContext): Promise<Envelope<TokenDTO[]>> {
        const result = await this.transportServices.tokens.getTokens({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Peer
        });
        return this.ok(result);
    }

    @GET
    @Path("/:id")
    @Accept("application/json", "image/png")
    public async getToken(
        @PathParam("id") id: string,
        @ContextAccept accept: string,
        @ContextResponse response: express.Response,
        @QueryParam("newQRCodeFormat") newQRCodeFormat?: boolean
    ): Promise<Envelope<TokenDTO> | void> {
        const result = await this.transportServices.tokens.getToken({ id });

        switch (accept) {
            case "image/png":
                return await this.qrCode(result, (r) => QRCode.for(newQRCodeFormat ? r.value.reference.url : r.value.reference.truncated), `${id}.png`, response, 200);
            default:
                return this.ok(result);
        }
    }
}
