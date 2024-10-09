import { ConnectorNotificationItem } from "./ConnectorNotificationItem";

export interface ConnectorNotification {
    "@type": "Notification";
    id: string;
    items: ConnectorNotificationItem[];
}
