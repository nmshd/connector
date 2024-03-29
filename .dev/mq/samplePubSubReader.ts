import { PubSub } from "@google-cloud/pubsub";

const pubSub = new PubSub({
    projectId: process.env.PUBSUB_PROJECT_ID,
    keyFile: process.env.PUBSUB_KEY_FILE
});

async function run() {
    const topicName = process.env.PUBSUB_TOPIC_NAME;
    const topic = pubSub.topic(topicName!);

    const topicExists = (await topic.exists())[0];
    if (!topicExists) throw new Error(`Topic '${topicName}' does not exist.`);

    const subscriptionName = process.env.PUBSUB_SUBSCRIPTION_NAME!;
    const subscription = topic.subscription(subscriptionName);
    const subscriptionExists = (await subscription.exists())[0];
    if (!subscriptionExists) throw new Error(`Subscription '${subscriptionName}' does not exist.`);

    subscription.on("message", (message) => {
        console.log(message.id);
        console.log(message.data.toString());
        console.log(message.attributes);

        message.ack();
    });
}

run();
