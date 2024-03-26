import { ConnectorNotificationItem } from "./ConnectorNotificationItem";

export interface ConnectorNotification {
    id: string;
    items: ConnectorNotificationItem[];
}
