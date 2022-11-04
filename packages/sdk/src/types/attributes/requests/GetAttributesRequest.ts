export interface GetAttributesRequest {
    createdAt?: string;
    content?: {
        "@type"?: string;
        tags?: string[];
        owner?: string;
        validFrom?: string;
        validTo?: string;
        key?: string;
        isTechnical?: string;
        confidentiality?: "public" | "private" | "protected";
        value?: {
            "@type"?: string;
        };
    };
    succeeds?: string;
    succeededBy?: string;
    shareInfo?: {
        requestReference?: string;
        peer?: string;
        sourceAttribute?: string;
    };
}
