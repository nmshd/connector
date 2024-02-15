import { ConnectorAttribute } from "../ConnectorAttribute";

export interface NotifyPeerAboutRepositoryAttributeSuccessionResponse {
    predecessor: ConnectorAttribute;
    successor: ConnectorAttribute;
    notificationId: string;
}
