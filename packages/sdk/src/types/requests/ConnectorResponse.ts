export interface ConnectorResponse {
    "@type": string;
    result: "Accepted" | "Rejected";
    requestId: string;
    items: (ConnectorResponseItemGroup | ConnectorResponseItem)[];
}

export interface ConnectorResponseItem {
    "@type": string;
    result: ConnectorResponseItemResult;
    metadata?: object;
}

export enum ConnectorResponseItemResult {
    Accepted = "Accepted",
    Rejected = "Rejected",
    Failed = "Error"
}

export interface ConnectorResponseItemGroup {
    "@type": string;
    items: ConnectorResponseItem[];
    metadata?: object;
}
