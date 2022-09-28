import { OwnerRestriction, TransportServices } from "@nmshd/runtime";
import { Reference } from "@nmshd/transport";
import express from "express";
import { Inject } from "typescript-ioc";
import { Accept, Context, ContextAccept, ContextResponse, Errors, FileParam, FormParam, GET, Path, PathParam, POST, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController, Mimetype } from "../common/BaseController";

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
        @FormParam("description") description?: string
    ): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.files.uploadOwnFile({
            content: file?.buffer,
            expiresAt,
            filename: file?.originalname,
            mimetype: file?.mimetype,
            title,
            description
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
        const result = await this.transportServices.files.getFiles({
            query: context.request.query
        });
        return this.ok(result);
    }

    @GET
    @Path("/Own")
    @Accept("application/json")
    public async getOwnFiles(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.files.getFiles({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Own
        });
        return this.ok(result);
    }

    @GET
    @Path("/Peer")
    @Accept("application/json")
    public async getPeerFiles(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.files.getFiles({
            query: context.request.query,
            ownerRestriction: OwnerRestriction.Peer
        });
        return this.ok(result);
    }

    @GET
    @Path(":idOrReference")
    // do not declare an @Accept here because the combination of @Accept and @GET causes an error that is logged but the functionality is not affected
    public async getFile(@PathParam("idOrReference") idOrReference: string, @ContextAccept accept: string, @ContextResponse response: express.Response): Promise<Envelope | void> {
        const fileId = idOrReference.startsWith("FIL") ? idOrReference : Reference.fromTruncated(idOrReference).id.toString();

        switch (accept) {
            case "image/png":
                const qrCodeResult = await this.transportServices.files.createQrCodeForFile({ fileId });
                return this.file(
                    qrCodeResult,
                    (r) => r.value.qrCodeBytes,
                    () => `${fileId}.png`,
                    () => Mimetype.png(),
                    response,
                    200
                );

            case "application/json":
                const result = await this.transportServices.files.getFile({ id: fileId });
                return this.ok(result);

            default:
                throw new Errors.NotAcceptableError();
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
                const qrCodeResult = await this.transportServices.files.createTokenQrCodeForFile({
                    fileId: id,
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
                const jsonResult = await this.transportServices.files.createTokenForFile({
                    fileId: id,
                    expiresAt: request.expiresAt,
                    ephemeral: request.ephemeral
                });
                return this.created(jsonResult);
        }
    }
}
