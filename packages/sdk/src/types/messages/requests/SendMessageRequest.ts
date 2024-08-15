import { ConnectorMessageContentDerivation } from "../ConnectorMessageContentDerivation";

export interface SendMessageRequest {
    recipients: string[];
    content: ConnectorMessageContentDerivation;
    attachments?: string[];
}
