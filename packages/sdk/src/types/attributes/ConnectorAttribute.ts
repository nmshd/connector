export interface ConnectorAttribute {
    id: string;
    createdAt: string;
    content: ConnectorIdentityAttribute | ConnectorRelationshipAttribute;
    succeeds?: string;
    succeededBy?: string;
    shareInfo?: ConnectorAttributeShareInfo;
}

export interface ConnectorAttributeShareInfo {
    requestReference: string;
    peer: string;
    sourceAttribute?: string;
}

export interface ConnectorBaseAttribute {
    "@type": string;
    "@context"?: string;
    "@version"?: string;
    owner: string;
    validFrom?: string;
    validTo?: string;
}

export interface ConnectorIdentityAttribute extends ConnectorBaseAttribute {
    value: ConnectorAttributeValue;
    tags?: string[];
}

export interface ConnectorRelationshipAttribute extends ConnectorBaseAttribute {
    value: ConnectorAttributeValue;
    key: string;
    isTechnical?: boolean;
    confidentiality: "public" | "private" | "protected";
}

export interface ConnectorAttributeValue {
    "@type": string;
    "@context"?: string;
    "@version"?: string;
    [key: string]: unknown;
}
