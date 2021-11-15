export interface SendMessageRequest {
    recipients: string[];
    content: any;
    attachments?: string[];
}
