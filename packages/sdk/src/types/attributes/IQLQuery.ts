export interface IQLQuery {
    "@type": "IQLQuery";
    queryString: string;
    attributeCreationHints?: {
        valueType: string;
        tags?: string[];
    };
}
