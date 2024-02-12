import { ConnectorAttribute } from "../ConnectorAttribute";

export interface NotifyPeerAboutIdentityAttributeSuccessionResponse {
    predecessor: ConnectorAttribute;
    successor: ConnectorAttribute;
    notificationId: string;
}
