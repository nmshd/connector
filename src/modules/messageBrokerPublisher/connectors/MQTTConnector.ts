import mqtt from "mqtt";
import { MessageBrokerConnector } from "./MessageBrokerConnector";

export interface MQTTConnectorConfiguration {
    brokerUrl: string;
}

export class MQTTConnector extends MessageBrokerConnector<MQTTConnectorConfiguration> {
    private client: mqtt.MqttClient;

    public async init(): Promise<void> {
        this.client = await mqtt.connectAsync(this.configuration.brokerUrl);
    }

    public async publish(namespace: string, data: Buffer): Promise<void> {
        await this.client.publishAsync(namespace.replaceAll(".", "/"), data);
    }

    public async close(): Promise<void> {
        await this.client.endAsync();
    }
}
