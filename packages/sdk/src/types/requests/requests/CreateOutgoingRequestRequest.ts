import { ConnectorRequestContent } from "../ConnectorRequestContent";

export interface CreateOutgoingRequestRequest {
    content: ConnectorRequestContent;
    peer: string;
}
