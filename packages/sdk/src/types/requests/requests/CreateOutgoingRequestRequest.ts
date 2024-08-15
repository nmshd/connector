import { ConnectorRequestContent } from "../ConnectorRequestContent";

export interface CreateOutgoingRequestRequest {
    content: Omit<ConnectorRequestContent, "@type"> & { "@type"?: "Request" };
    peer: string;
}
