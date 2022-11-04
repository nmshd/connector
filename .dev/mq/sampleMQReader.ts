import rabbit from "amqplib";

async function run() {
    const connection = await rabbit.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await this.channel.assertExchange("nmshd", "fanout");

    const queueName = "myQueue";

    await channel.assertQueue(queueName);
    await channel.bindQueue(queueName, "nmshd", "*.*");

    await channel.consume(queueName, (msg) => {
        if (!msg) return;
        console.log(msg.fields);
        console.log(msg.properties);
        console.log(JSON.parse(msg.content.toString()));
        channel.ack(msg);
    });
}

run();
