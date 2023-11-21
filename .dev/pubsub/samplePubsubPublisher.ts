import { PubSub } from "@google-cloud/pubsub";

const pubSub = new PubSub({
    projectId: process.env.PUBSUB_PROJECT_ID,
    keyFile: process.env.PUBSUB_KEY_FILE
});

async function run() {
    const topicName = process.env.PUBSUB_TOPIC_NAME;
    const topic = pubSub.topic(topicName!);

    const topicExists = (await topic.exists())[0];
    if (!topicExists) throw new Error(`Topic ${topicName} does not exist.`);

    const x = await topic.publishMessage({ json: { foo: "bar" }, attributes: { namespace: "test" } });
    console.log(x);
}

run();
