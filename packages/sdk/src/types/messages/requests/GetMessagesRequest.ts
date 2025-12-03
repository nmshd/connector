export interface GetMessagesRequest {
    isOwn?: string;
    createdBy?: string | string[];
    createdByDevice?: string | string[];
    createdAt?: string | string[];
    recipients?: { address?: string | string[]; relationshipId?: string | string[] };
    participant?: string | string[];
    attachments?: string | string[];
    content?: {
        "@type"?: string | string[];
        subject?: string | string[];
        body?: string | string[];
        bodyFormat?: string | string[];
    };
}
