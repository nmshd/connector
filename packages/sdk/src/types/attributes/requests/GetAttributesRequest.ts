export interface GetAttributesRequest {
    "@type"?: string | string[];
    createdAt?: string;
    content?: {
        "@type"?: string | string[];
        tags?: string | string[];
        owner?: string | string[];
        key?: string | string[];
        isTechnical?: string | string[];
        confidentiality?: "public" | "private" | "protected";
        value?: {
            "@type"?: string | string[];
        };
    };
    succeeds?: string | string[];
    succeededBy?: string | string[];
    peer?: string | string[];
    sourceReference?: string | string[];
    initialAttributePeer?: string | string[];
    deletionInfo?: {
        deletionStatus?: string | string[];
        deletionDate?: string | string[];
    };
}
