export interface GetOutgoingRequestsRequest {
    id?: string | string[];
    peer?: string | string[];
    createdAt?: string | string[];
    status?: string | string[];
    content?: {
        expiresAt?: string | string[];
        items?: {
            "@type"?: string | string[];
        };
    };
    source?: {
        type?: string | string[];
        reference?: string | string[];
    };
    response?: {
        createdAt?: string | string[];
        source?: {
            type?: string | string[];
            reference?: string | string[];
        };
        content?: {
            result?: string | string[];
            items?: {
                "@type"?: string | string[];
                items?: {
                    "@type"?: string | string[];
                };
            };
        };
    };
}
