import { BaseController, Envelope, Mimetype, QRCode } from "@nmshd/connector-types";
import { Reference } from "@nmshd/core-types";
import { OwnerRestriction, TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, ContextAccept, ContextResponse, DELETE, FileParam, FormParam, GET, Path, PathParam, POST, Return, ServiceContext } from "@nmshd/typescript-rest";
import express from "express";

@Path("/api/v2/Files")
export class FilesController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Path("/Own")
    @Accept("application/json")
    public async uploadOwnFile(
        @FormParam("expiresAt") expiresAt: string,
        @FormParam("title") title: string,
        @FileParam("file") file?: Express.Multer.File,
        @FormParam("description") description?: string,
        @FormParam("tags") tags?: string[]
    ): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.files.uploadOwnFile({
            content: file?.buffer,
            expiresAt,
            filename: file?.originalname !== undefined ? Buffer.from(file.originalname, "latin1").toString("utf8") : undefined,
            mimetype: file?.mimetype,
            title,
            description,
            tags
        } as any);
        return this.created(result);
    }

    @POST
    @Path("/Peer")
    @Accept("application/json")
    public async loadPeerFile(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.files.getOrLoadFile(request);
        return this.created(result);
    }

    @GET
    @Path("/:id/Download")
    public async downloadFile(@PathParam("id") id: string, @ContextResponse response: express.Response): Promise<void> {
        const result = await this.transportServices.files.downloadFile({ id });

        return this.file(
            result,
            (r) => r.value.content,
            (r) => r.value.filename,
            () => new Mimetype(result.value.mimetype),
            response,
            200
        );
    }

    @GET
    @Accept("application/json")
    public async getFiles(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.files.getFiles({ query: context.request.query });
        return this.ok(result);
    }

    @GET
    @Path("/Own")
    @Accept("application/json")
    public async getOwnFiles(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.files.getFiles({ query: context.request.query, ownerRestriction: OwnerRestriction.Own });
        return this.ok(result);
    }

    @GET
    @Path("/Peer")
    @Accept("application/json")
    public async getPeerFiles(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.files.getFiles({ query: context.request.query, ownerRestriction: OwnerRestriction.Peer });
        return this.ok(result);
    }

    @GET
    @Path("/:idOrReference")
    @Accept("application/json", "image/png")
    public async getFile(@PathParam("idOrReference") idOrReference: string, @ContextAccept accept: string, @ContextResponse response: express.Response): Promise<Envelope | void> {
        const fileId = idOrReference.startsWith("FIL") ? idOrReference : Reference.fromTruncated(idOrReference).id.toString();

        const result = await this.transportServices.files.getFile({ id: fileId });

        switch (accept) {
            case "image/png":
                return await this.qrCode(result, (r) => QRCode.for(r.value.truncatedReference), `${fileId}.png`, response, 200);
            default:
                return this.ok(result);
        }
    }

    @POST
    @Path("/:id/Token")
    @Accept("application/json", "image/png")
    public async createTokenForFile(
        @PathParam("id") id: string,
        @ContextAccept accept: string,
        @ContextResponse response: express.Response,
        request: any
    ): Promise<Return.NewResource<Envelope> | void> {
        const result = await this.transportServices.files.createTokenForFile({
            fileId: id,
            expiresAt: request.expiresAt,
            ephemeral: request.ephemeral || accept === "image/png",
            forIdentity: request.forIdentity,
            passwordProtection: request.passwordProtection
        });

        switch (accept) {
            case "image/png":
                return await this.qrCode(result, (r) => QRCode.for(r.value.truncatedReference), `${id}.png`, response, 201);
            default:
                return this.created(result);
        }
    }

    @DELETE
    @Path("/:id")
    public async deleteFile(@PathParam("id") fileId: string): Promise<void> {
        const result = await this.transportServices.files.deleteFile({ fileId });
        return this.noContent(result);
    }
}
