import { FileDTO, MessageDTO, MessageWithAttachmentsDTO } from "@nmshd/runtime-types";
import { AxiosInstance } from "axios";
import { ConnectorHttpResponse, GetMessagesRequest, SendMessageRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class MessagesEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getMessages(request?: GetMessagesRequest): Promise<ConnectorHttpResponse<MessageDTO[]>> {
        return await this.get("/api/core/v1/Messages", request);
    }

    public async sendMessage(request: SendMessageRequest): Promise<ConnectorHttpResponse<MessageDTO>> {
        return await this.post("/api/core/v1/Messages", request);
    }

    public async getMessage(messageId: string): Promise<ConnectorHttpResponse<MessageWithAttachmentsDTO>> {
        return await this.get(`/api/core/v1/Messages/${messageId}`);
    }

    public async getAttachment(messageId: string, attachmentId: string): Promise<ConnectorHttpResponse<FileDTO>> {
        return await this.get(`/api/core/v1/Messages/${messageId}/Attachments/${attachmentId}`);
    }

    public async downloadAttachment(messageId: string, attachmentId: string): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.download(`/api/core/v1/Messages/${messageId}/Attachments/${attachmentId}/Download`);
    }
}
