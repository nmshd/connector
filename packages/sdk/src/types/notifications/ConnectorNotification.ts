import { ConnectorNotificationItem } from "./ConnectorNotificationItem";

export interface ConnectorNotification {
    "@type": "Notification";

    id: string;

    /**
     * The items of the Notification.
     */
    items: ConnectorNotificationItem[];
}
