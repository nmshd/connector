export interface RelationshipAttributeQuery {
    "@type"?: "RelationshipAttributeQuery";
    validFrom?: string;
    validTo?: string;
    key: string;
    owner: string;
    attributeCreationHints: RelationshipAttributeCreationHints;
}

export interface RelationshipAttributeCreationHints {
    title: string;
    valueType: string;
    description?: string;
    valueHints?: ValueHints;
    isTechnical?: boolean;
    confidentiality: "public" | "private" | "protected";
}

export interface ValueHints {
    "@type": "ValueHints";
    editHelp?: string;
    min?: number;
    max?: number;
    pattern?: string;
    values?: ValueHintsValue[];
    defaultValue?: string | number | boolean;
}

export interface ValueHintsValue {
    "@type": "ValueHintsValue";
    key: string | number | boolean;
    displayName: string;
}
