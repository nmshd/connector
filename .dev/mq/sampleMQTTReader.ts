import mqtt from "mqtt";

async function run() {
    const client = await mqtt.connectAsync("mqtt://test.mosquitto.org:1883");

    await client.subscribeAsync("nmshd/#");

    client.on("message", (topic, message) => {
        // message is Buffer
        console.log(`Received '${message.toString()}' for topic '${topic}'`);
    });
}

run();
