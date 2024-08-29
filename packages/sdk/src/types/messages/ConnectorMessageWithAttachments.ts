import { ArbitraryMessageContentJSON, MailJSON, NotificationJSON, RequestJSON, ResponseWrapperJSON } from "@nmshd/content";
import { ConnectorFile } from "../files/ConnectorFile";
import { ConnectorMessageRecipient } from "./ConnectorMessageRecipient";

export interface ConnectorMessageWithAttachments {
    id: string;
    content: MailJSON | ResponseWrapperJSON | RequestJSON | NotificationJSON | ArbitraryMessageContentJSON;
    createdBy: string;
    createdByDevice: string;
    recipients: ConnectorMessageRecipient[];
    createdAt: string;
    attachments: ConnectorFile[];
    isOwn: boolean;
}
