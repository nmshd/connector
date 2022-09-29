import { TransportServices } from "@nmshd/runtime";
import express from "express";
import { Inject } from "typescript-ioc";
import { Accept, Context, ContextResponse, GET, Path, PathParam, POST, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController, Mimetype } from "../common/BaseController";

@Path("/api/v2/Messages")
export class MessagesController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Accept("application/json")
    public async sendMessage(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.transportServices.messages.sendMessage(request);
        return this.created(result);
    }

    @GET
    @Accept("application/json")
    public async getMessages(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.messages.getMessages({
            query: context.request.query
        });

        return this.ok(result);
    }

    @GET
    @Path(":id")
    @Accept("application/json")
    public async getMessage(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.transportServices.messages.getMessage({ id });
        return this.ok(result);
    }

    @GET
    @Path(":id/Attachments/:attachmentId")
    @Accept("application/json")
    public async getMessageAttachmentMetadata(@PathParam("id") id: string, @PathParam("attachmentId") attachmentId: string): Promise<Envelope> {
        const result = await this.transportServices.messages.getAttachmentMetadata({ id, attachmentId });
        return this.ok(result);
    }

    @GET
    @Path(":id/Attachments/:attachmentId/Download")
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
