export interface RelationshipAttributeQuery {
    "@type"?: "RelationshipAttributeQuery";
    valueType: string;
    validFrom?: string;
    validTo?: string;
    key: string;
    owner: string;
    thirdParty?: string;
    attributeCreationHints: RelationshipAttributeCreationHints;
}

export interface RelationshipAttributeCreationHints {
    title: string;
    description?: string;
    valueHints?: ValueHints;
    isTechnical?: boolean;
    confidentiality: "public" | "private" | "protected";
}

export interface ValueHints {
    "@type": "ValueHints";
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
    "@type": "ValueHintsValue";
    "@context"?: string;
    "@version"?: string;
    key: string | number | boolean;
    displayName: string;
}
