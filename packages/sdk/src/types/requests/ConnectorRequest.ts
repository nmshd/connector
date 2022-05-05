export interface ConnectorRequest {
    id: string;
    isOwn: boolean;
    peer: string;
    createdAt: string;
    status: ConnectorRequestStatus;
    content: any;
    source?: ConnectorRequestSource;
    response?: ConnectorRequestResponse;
}

export declare enum ConnectorRequestStatus {
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
    content: any;
    source?: ConnectorRequestResponseSource;
}

export interface ConnectorRequestResponseSource {
    type: "Message" | "RelationshipChange";
    reference: string;
}
