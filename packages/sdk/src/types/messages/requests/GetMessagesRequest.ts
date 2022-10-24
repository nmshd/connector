export interface GetMessagesRequest {
    createdBy?: string | string[];
    createdByDevice?: string | string[];
    createdAt?: string | string[];
    recipients?: { address?: string | string[]; relationshipId: string | string[] };
    participant?: string | string[];
    attachments?: string | string[];
    contentType?: string | string[];
    contentSubject?: string | string[];
    contentBody?: string | string[];
}
