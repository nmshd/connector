import { RequestJSON } from "@nmshd/content";

export interface CreateOutgoingRequestRequest {
    content: Omit<RequestJSON, "@type"> & { "@type"?: "Request" };
    peer: string;
}
