import { sleep } from "@js-soft/ts-utils";
import mqtt from "mqtt";

async function run() {
    const client = await mqtt.connectAsync("mqtt://test.mosquitto.org:1883");

    await client.subscribeAsync("nmshd/#");

    client.on("message", (topic, message) => {
        // message is Buffer
        console.log(`Received '${message.toString()}' for topic '${topic}'`);
    });

    let x = 0;
    while (x < 10) {
        client.publish("nmshd/bruh.brah.breh", Buffer.from(JSON.stringify({ brih: "bruh", x })));

        await sleep(500);
        x++;
    }
}

run();
