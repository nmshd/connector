import { ConnectorIdentityAttribute } from "../ConnectorAttribute";

export interface SucceedIdentityAttributeRequest {
    predecessorId: string;
    successorContent: {
        value: ConnectorIdentityAttribute;
        tags?: string[];
        validFrom?: string;
        validTo?: string;
    };
}
