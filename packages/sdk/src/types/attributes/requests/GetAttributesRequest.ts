export interface GetAttributesRequest {
    "@type"?: string;
    peer?: string;
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
    shareInfo?: {
        requestReference?: string;
        peer?: string;
        sourceAttribute?: string;
        thirdPartyAddress?: string;
    };
}
