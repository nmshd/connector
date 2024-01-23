// TODO: Remove obsolete routes
import { ConnectorAttributeValue } from "../ConnectorAttribute";

export interface SucceedIdentityAttributeRequest {
    predecessorId: string;
    successorContent: {
        value: ConnectorAttributeValue;
        tags?: string[];
        validFrom?: string;
        validTo?: string;
    };
}
