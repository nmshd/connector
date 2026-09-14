import { BaseController, Envelope, Mimetype } from "@nmshd/connector-types";
import { FileDTO, MessageDTO, MessageWithAttachmentsDTO, TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, ContextResponse, GET, Path, PathParam, POST, Return, Security, ServiceContext } from "@nmshd/typescript-rest";
import express from "express";

@Security("core:messages")
@Path("/api/core/v1/Messages")
export class MessagesController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Accept("application/json")
    public async sendMessage(request: any): Promise<Return.NewResource<Envelope<MessageDTO>>> {
        const result = await this.transportServices.messages.sendMessage(request);
        return this.created(result);
    }

    @GET
    @Accept("application/json")
    public async getMessages(@Context context: ServiceContext): Promise<Envelope<MessageDTO[]>> {
        const result = await this.transportServices.messages.getMessages({
            query: context.request.query
        });

        return this.ok(result);
    }

    @GET
    @Path("/:id")
    @Accept("application/json")
    public async getMessage(@PathParam("id") id: string): Promise<Envelope<MessageWithAttachmentsDTO>> {
        const result = await this.transportServices.messages.getMessage({ id });
        return this.ok(result);
    }

    @GET
    @Path("/:id/Attachments/:attachmentId")
    @Accept("application/json")
    public async getMessageAttachmentMetadata(@PathParam("id") id: string, @PathParam("attachmentId") attachmentId: string): Promise<Envelope<FileDTO>> {
        const result = await this.transportServices.messages.getAttachmentMetadata({ id, attachmentId });
        return this.ok(result);
    }

    @GET
    @Path("/:id/Attachments/:attachmentId/Download")
    @Accept("application/json")
    public async downloadMessageAttachment(
        @PathParam("id") id: string,
        @PathParam("attachmentId") attachmentId: string,
        @ContextResponse response: express.Response
    ): Promise<void> {
        const result = await this.transportServices.messages.downloadAttachment({ id, attachmentId });

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
