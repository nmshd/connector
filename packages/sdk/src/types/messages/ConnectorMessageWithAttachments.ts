import { ConnectorFile } from "../files/ConnectorFile";
import { ConnectorMessageRecipient } from "./ConnectorMessageRecipient";

export interface ConnectorMessageWithAttachments {
    id: string;
    content: unknown;
    createdBy: string;
    createdByDevice: string;
    recipients: ConnectorMessageRecipient[];
    relationshipIds: string[];
    createdAt: string;
    attachments: ConnectorFile[];
}
