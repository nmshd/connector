export interface GetRelationshipsRequest {
    templateId?: string | string[];
    lastMessageReceivedAt?: string | string[];
    lastMessageSentAt?: string | string[];
    peer?: string | string[];
    status?: string | string[];
}
