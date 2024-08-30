import { ArbitraryMessageContentJSON, MailJSON, NotificationJSON, RequestJSON, ResponseWrapperJSON } from "@nmshd/content";
import { ConnectorMessageRecipient } from "./ConnectorMessageRecipient";

export interface ConnectorMessage {
    id: string;
    content: MailJSON | ResponseWrapperJSON | RequestJSON | NotificationJSON | ArbitraryMessageContentJSON;
    createdBy: string;
    createdByDevice: string;
    recipients: ConnectorMessageRecipient[];
    createdAt: string;
    attachments: string[];
    isOwn: boolean;
}
