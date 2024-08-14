export interface ConnectorResponse {
    "@type": "Response";
    result: "Accepted" | "Rejected";
    requestId: string;
    items: (ConnectorResponseItemGroup | ConnectorResponseItem)[];
}

export interface ConnectorResponseItem {
    "@type": string;
    result: ConnectorResponseItemResult;
    metadata?: object;
    [key: string]: any;
}

export enum ConnectorResponseItemResult {
    Accepted = "Accepted",
    Rejected = "Rejected",
    Failed = "Error"
}

export interface ConnectorResponseItemGroup {
    "@type": "ResponseItemGroup";
    items: ConnectorResponseItem[];
    metadata?: object;
}
