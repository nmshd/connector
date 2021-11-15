import { ConnectorMessageRecipient } from "./ConnectorMessageRecipient";

export interface ConnectorMessage {
    id: string;
    content: any;
    createdBy: string;
    createdByDevice: string;
    recipients: ConnectorMessageRecipient[];
    relationshipIds: string[];
    createdAt: string;
    attachments: string[];
}
