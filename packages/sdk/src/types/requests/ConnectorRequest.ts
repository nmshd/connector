import { RequestJSON, ResponseJSON } from "@nmshd/content";

export interface ConnectorRequest {
    id: string;
    isOwn: boolean;
    peer: string;
    createdAt: string;
    status: ConnectorRequestStatus;
    content: RequestJSON;
    source?: {
        type: "Message" | "RelationshipTemplate";
        reference: string;
    };
    response?: {
        createdAt: string;
        content: ResponseJSON;
        source?: {
            type: "Message" | "Relationship";
            reference: string;
        };
    };
}

export enum ConnectorRequestStatus {
    Draft = "Draft",
    Open = "Open",
    DecisionRequired = "DecisionRequired",
    ManualDecisionRequired = "ManualDecisionRequired",
    Decided = "Decided",
    Completed = "Completed"
}
