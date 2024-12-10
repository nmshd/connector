import { AxiosInstance } from "axios";
import { ConnectorFile, ConnectorHttpResponse, ConnectorMessage, ConnectorMessages, ConnectorMessageWithAttachments, GetMessagesRequest, SendMessageRequest } from "../types";
import { CorrelationID, Endpoint } from "./Endpoint";

export class MessagesEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getMessages(request?: GetMessagesRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorMessages>> {
        return await this.get("/api/v2/Messages", request, correlationId);
    }

    public async sendMessage(request: SendMessageRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorMessage>> {
        return await this.post("/api/v2/Messages", request, undefined, undefined, correlationId);
    }

    public async getMessage(messageId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorMessageWithAttachments>> {
        return await this.get(`/api/v2/Messages/${messageId}`, undefined, correlationId);
    }

    public async getAttachment(messageId: string, attachmentId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorFile>> {
        return await this.get(`/api/v2/Messages/${messageId}/Attachments/${attachmentId}`, undefined, correlationId);
    }

    public async downloadAttachment(messageId: string, attachmentId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.download(`/api/v2/Messages/${messageId}/Attachments/${attachmentId}/Download`, correlationId);
    }
}
