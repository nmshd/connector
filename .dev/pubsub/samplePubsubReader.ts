import { PubSub } from "@google-cloud/pubsub";

const pubsub = new PubSub({
    projectId: process.env.PUBSUB_PROJECT_ID,
    keyFile: process.env.PUBSUB_KEY_FILE
});

async function run() {
    const topicName = process.env.PUBSUB_TOPIC_NAME;
    const topic = pubsub.topic(topicName!);

    const topicExists = (await topic.exists())[0];
    if (!topicExists) throw new Error(`Topic ${topicName} does not exist.`);

    const subscription = topic.subscription(process.env.PUBSUB_SUBSCRIPTION_NAME!);
    const subscriptionExists = (await subscription.exists())[0];
    if (!subscriptionExists) throw new Error(`Subscription ${topicName} does not exist.`);

    subscription.on("message", (message) => {
        console.log(message.id);
        console.log(message.data.toString());
        console.log(message.attributes);

        message.ack();
    });
}

run();
