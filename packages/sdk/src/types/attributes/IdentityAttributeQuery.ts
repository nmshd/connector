export interface IdentityAttributeQuery {
    "@type"?: "IdentityAttributeQuery";
    valueType: string;
    validFrom?: string;
    validTo?: string;
    tags?: string[];
}
