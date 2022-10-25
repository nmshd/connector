import { ConnectorRequestContent } from "./ConnectorRequestContent";

export interface ConnectorRequest {
    id: string;
    isOwn: boolean;
    peer: string;
    createdAt: string;
    status: ConnectorRequestStatus;
    content: ConnectorRequestContent;
    source?: ConnectorRequestSource;
    response?: ConnectorRequestResponse;
}

export enum ConnectorRequestStatus {
    Draft = "Draft",
    Open = "Open",
    DecisionRequired = "DecisionRequired",
    ManualDecisionRequired = "ManualDecisionRequired",
    Decided = "Decided",
    Completed = "Completed"
}

export interface ConnectorRequestSource {
    type: "Message" | "RelationshipTemplate";
    reference: string;
}

export interface ConnectorRequestResponse {
    createdAt: string;
    content: ConnectorRequestResponseContent;
    source?: ConnectorRequestResponseSource;
}

export interface ConnectorRequestResponseSource {
    type: "Message" | "RelationshipChange";
    reference: string;
}

export interface ConnectorRequestResponseContent {
    "@type": string;
    result: ConnectorRequestResponseResult;
    requestId: string;
    items: (ConnectorRequestResponseItemGroup | ConnectorRequestResponseItem)[];
}

export enum ConnectorRequestResponseResult {
    Accepted = "Accepted",
    Rejected = "Rejected"
}

export interface ConnectorRequestResponseItem {
    "@type": string;
    result: ConnectorRequestResponseItemResult;
    metadata?: object;
}

export enum ConnectorRequestResponseItemResult {
    Accepted = "Accepted",
    Rejected = "Rejected",
    Failed = "Error"
}

export interface ConnectorRequestResponseItemGroup {
    "@type": string;
    items: ConnectorRequestResponseItem[];
    metadata?: object;
}
