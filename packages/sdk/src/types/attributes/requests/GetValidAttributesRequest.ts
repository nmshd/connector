export interface GetValidAttributesRequest {
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
    shareInfo?: {
        requestReference?: string;
        peer?: string;
        sourceAttribute?: string;
    };
}
