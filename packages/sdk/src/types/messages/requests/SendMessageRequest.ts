export interface SendMessageRequest {
    recipients: string[];
    content: unknown;
    attachments?: string[];
}
