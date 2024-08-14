import { ConnectorNotification } from "../notifications";
import { ConnectorRequestContent, ConnectorResponse } from "../requests";

export type ConnectorMessageContentDerivation = ConnectorMail | ConnectorResponseWrapper | ConnectorRequestContent | ConnectorNotification | ConnectorArbitraryMessageContent;

export interface ConnectorMail {
    "@type": "Mail";
    to: string[];
    cc?: string[];
    subject: string;
    body: string;
}

export interface ConnectorResponseWrapper {
    "@type": "ResponseWrapper";
    requestId: string;
    requestSourceReference: string;
    requestSourceType: "RelationshipTemplate" | "Message";
    response: ConnectorResponse;
}

export interface ConnectorArbitraryMessageContent {
    "@type": "ArbitraryMessageContent";
    value: any;
}
