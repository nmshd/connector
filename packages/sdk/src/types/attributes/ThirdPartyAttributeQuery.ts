export interface ThirdPartyAttributeQuery {
    "@type"?: "ThirdPartyRelationshipAttributeQuery";
    key: string;
    owner: string;
    thirdParty: string[];
    validFrom?: string;
    validTo?: string;
}
