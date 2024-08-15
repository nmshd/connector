import { ConnectorMessageContentDerivation } from "./ConnectorMessageContentDerivation";
import { ConnectorMessageRecipient } from "./ConnectorMessageRecipient";

export interface ConnectorMessage {
    id: string;
    content: ConnectorMessageContentDerivation;
    createdBy: string;
    createdByDevice: string;
    recipients: ConnectorMessageRecipient[];
    createdAt: string;
    attachments: string[];
    isOwn: boolean;
}
