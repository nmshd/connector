export interface IQLQuery {
    "@type"?: "IQLQuery";
    queryString: string;
    validFrom?: string;
    validTo?: string;
    attributeCreationHints?: {
        valueType: string;
        tags?: string[];
    };
}
