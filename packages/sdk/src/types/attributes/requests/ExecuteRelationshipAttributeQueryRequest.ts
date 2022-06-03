export interface ExecuteRelationshipAttributeQueryRequest {
    valueType?: string;
    validFrom?: string;
    validTo?: string;
    key: string;
    owner: string;
    thirdParty?: string;
    attributeHints: RelationshipAttributeHints;
}

export interface RelationshipAttributeHints {
    title: string;
    description?: string;
    valueHints?: ValueHints;
    isTechnical?: boolean;
    confidentiality: "public" | "private" | "protected";
}

export interface ValueHints {
    "@type": string;
    "@context"?: string;
    "@version"?: string;
    editHelp?: string;
    min?: number;
    max?: number;
    pattern?: string;
    values?: ValueHintsValue[];
    defaultValue?: string | number | boolean;
}

export interface ValueHintsValue {
    key: string | number | boolean;
    displayName: string;
}
