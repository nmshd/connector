import { ConnectorAttribute } from "../ConnectorAttribute";

export interface SucceedAttributeResponse {
    predecessor: ConnectorAttribute;
    successor: ConnectorAttribute;
}
