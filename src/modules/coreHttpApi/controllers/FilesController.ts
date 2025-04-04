import { BaseController, Envelope, Mimetype } from "@nmshd/connector-types";
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
    @Path(":id/Download")
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
    @Path(":idOrReference")
    @Accept("application/json", "image/png")
    public async getFile(@PathParam("idOrReference") idOrReference: string, @ContextAccept accept: string, @ContextResponse response: express.Response): Promise<Envelope | void> {
        const fileId = idOrReference.startsWith("FIL") ? idOrReference : Reference.fromTruncated(idOrReference).id.toString();

        switch (accept) {
            case "image/png":
                const qrCodeResult = await this.transportServices.files.createQRCodeForFile({ fileId });
                return this.file(
                    qrCodeResult,
                    (r) => r.value.qrCodeBytes,
                    () => `${fileId}.png`,
                    () => Mimetype.png(),
                    response,
                    200
                );

            default:
                const result = await this.transportServices.files.getFile({ id: fileId });
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
        switch (accept) {
            case "image/png":
                const qrCodeResult = await this.transportServices.files.createTokenQRCodeForFile({
                    fileId: id,
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
                const jsonResult = await this.transportServices.files.createTokenForFile({
                    fileId: id,
                    expiresAt: request.expiresAt,
                    ephemeral: request.ephemeral,
                    forIdentity: request.forIdentity,
                    passwordProtection: request.passwordProtection
                });
                return this.created(jsonResult);
        }
    }

    @DELETE
    @Path("/:id")
    public async deleteFile(@PathParam("id") fileId: string): Promise<void> {
        const result = await this.transportServices.files.deleteFile({ fileId });
        return this.noContent(result);
    }
}
