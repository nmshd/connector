import { AxiosInstance } from "axios";
import { ConnectorFile, ConnectorHttpResponse, ConnectorMessage, ConnectorMessages, ConnectorMessageWithAttachments, GetMessagesRequest, SendMessageRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class MessagesEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getMessages(request?: GetMessagesRequest): Promise<ConnectorHttpResponse<ConnectorMessages>> {
        return await this.get("/api/v2/Messages", request);
    }

    public async sendMessage(request: SendMessageRequest): Promise<ConnectorHttpResponse<ConnectorMessage>> {
        return await this.post("/api/v2/Messages", request);
    }

    public async getMessage(messageId: string): Promise<ConnectorHttpResponse<ConnectorMessageWithAttachments>> {
        return await this.get(`/api/v2/Messages/${messageId}`);
    }

    public async getAttachment(messageId: string, attachmentId: string): Promise<ConnectorHttpResponse<ConnectorFile>> {
        return await this.get(`/api/v2/Messages/${messageId}/Attachments/${attachmentId}`);
    }

    public async downloadAttachment(messageId: string, attachmentId: string): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.download(`/api/v2/Messages/${messageId}/Attachments/${attachmentId}/Download`);
    }
}
