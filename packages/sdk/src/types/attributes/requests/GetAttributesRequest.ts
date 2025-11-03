export interface GetAttributesRequest {
    "@type"?: string;
    createdAt?: string;
    content?: {
        "@type"?: string;
        tags?: string[];
        owner?: string;
        key?: string;
        isTechnical?: string;
        confidentiality?: "public" | "private" | "protected";
        value?: {
            "@type"?: string;
        };
    };
    succeeds?: string;
    succeededBy?: string;
    peer?: string;
    sourceReference?: string;
    initialAttributePeer?: string;
    deletionInfo?: {
        deletionStatus?: string;
        deletionDate?: string;
    };
}
