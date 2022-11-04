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
    owner: string;
    validFrom?: string;
    validTo?: string;
}

export interface ConnectorIdentityAttribute extends ConnectorBaseAttribute {
    "@type": "IdentityAttribute";
    value: ConnectorAttributeValue;
    tags?: string[];
}

export interface ConnectorRelationshipAttribute extends ConnectorBaseAttribute {
    "@type": "RelationshipAttribute";
    value: ConnectorAttributeValue;
    key: string;
    isTechnical?: boolean;
    confidentiality: "public" | "private" | "protected";
}

export interface ConnectorAttributeValue {
    "@type": string;
    [key: string]: unknown;
}
