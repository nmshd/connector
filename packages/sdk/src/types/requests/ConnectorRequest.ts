import { ConnectorRequestContent } from "./ConnectorRequestContent";
import { ConnectorResponse } from "./ConnectorResponse";

export interface ConnectorRequest {
    id: string;
    isOwn: boolean;
    peer: string;
    createdAt: string;
    status: ConnectorRequestStatus;
    content: ConnectorRequestContent;
    source?: {
        type: "Message" | "RelationshipTemplate";
        reference: string;
    };
    response?: {
        createdAt: string;
        content: ConnectorResponse;
        source?: {
            type: "Message" | "RelationshipChange";
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
