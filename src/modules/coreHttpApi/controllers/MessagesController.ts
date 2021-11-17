import { TransportServices } from "@nmshd/runtime";
import express from "express";
import { Inject } from "typescript-ioc";
import { Context, ContextResponse, GET, Path, PathParam, POST, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController, Mimetype } from "../common/BaseController";

@Path("/api/v1/Messages")
export class MessagesController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    public async sendMessage(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.messages.sendMessage(request);
        return this.created(result);
    }

    @GET
    public async getMessages(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.messages.getMessages({
            query: context.request.query
        });

        return this.ok(result);
    }

    @Path(":id")
    @GET
    public async getMessage(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.messages.getMessage({
            id: id
        });
        return this.ok(result);
    }

    @Path(":id/Attachments/:attachmentId")
    @GET
    public async getMessageAttachmentMetadata(@PathParam("id") id: string, @PathParam("attachmentId") attachmentId: string): Promise<Envelope> {
        const result = await this.transportServices.messages.getAttachmentMetadata({
            id: id,
            attachmentId: attachmentId
        });

        return this.ok(result);
    }

    @Path(":id/Attachments/:attachmentId/Download")
    @GET
    public async downloadMessageAttachment(
        @PathParam("id") id: string,
        @PathParam("attachmentId") attachmentId: string,
        @ContextResponse response: express.Response
    ): Promise<void> {
        const result = await this.transportServices.messages.downloadAttachment({
            id: id,
            attachmentId: attachmentId
        });

        return this.file(
            result,
            (r) => r.value.content,
            (r) => r.value.filename,
            (r) => new Mimetype(r.value.mimetype),
            response,
            200
        );
    }
}
