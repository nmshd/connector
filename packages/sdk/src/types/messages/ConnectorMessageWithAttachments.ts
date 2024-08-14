import { ConnectorFile } from "../files/ConnectorFile";
import { ConnectorMessageContentDerivation } from "./ConnectorMessageContentDerivation";
import { ConnectorMessageRecipient } from "./ConnectorMessageRecipient";

export interface ConnectorMessageWithAttachments {
    id: string;
    content: ConnectorMessageContentDerivation;
    createdBy: string;
    createdByDevice: string;
    recipients: ConnectorMessageRecipient[];
    createdAt: string;
    attachments: ConnectorFile[];
    isOwn: boolean;
}
