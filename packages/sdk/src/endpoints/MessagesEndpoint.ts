import { AxiosInstance } from "axios";
import { ConnectorFile, ConnectorMessage, ConnectorMessages, ConnectorMessageWithAttachments, ConnectorResponse, GetMessagesRequest, SendMessageRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class MessagesEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getMessages(request?: GetMessagesRequest): Promise<ConnectorResponse<ConnectorMessages>> {
        return await this.get("/api/v2/Messages", request);
    }

    public async sendMessage(request: SendMessageRequest): Promise<ConnectorResponse<ConnectorMessage>> {
        return await this.post("/api/v2/Messages", request);
    }

    public async getMessage(messageId: string): Promise<ConnectorResponse<ConnectorMessageWithAttachments>> {
        return await this.get(`/api/v2/Messages/${messageId}`);
    }

    public async getAttachment(messageId: string, attachmentId: string): Promise<ConnectorResponse<ConnectorFile>> {
        return await this.get(`/api/v2/Messages/${messageId}/Attachments/${attachmentId}`);
    }

    public async downloadAttachment(messageId: string, attachmentId: string): Promise<ConnectorResponse<ArrayBuffer>> {
        return await this.download(`/api/v2/Messages/${messageId}/Attachments/${attachmentId}/Download`);
    }
}
