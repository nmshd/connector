import * as redis from "redis";

async function run() {
    const client = redis.createClient({ url: "redis://localhost" });
    const subscriber = client.duplicate();

    await subscriber.connect();

    await subscriber.pSubscribe("*", (message, channel) => {
        console.log(`Received '${message}' for channel '${channel}'`);
    });
}

run();
