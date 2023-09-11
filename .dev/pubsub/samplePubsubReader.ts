import { PubSub } from "@google-cloud/pubsub";

async function run() {
    const pubsub = new PubSub({
        projectId: "testtrolololo",
        credentials: {
            private_key: process.env.PUBSUB_PRIVATE_KEY,
            client_email: process.env.PUBSUB_CLIENT_EMAIL
        }
    });

    await pubsub.createTopic("asd").catch((e) => console.log(e.message));
    const topic = pubsub.topic("asd");

    await topic.createSubscription("asd").catch((e) => console.log(e.message));
    const subscription = topic.subscription("asd");

    subscription.on("message", (message) => {
        console.log(message.id);
        console.log(message.data.toString());
    });
}

run();
