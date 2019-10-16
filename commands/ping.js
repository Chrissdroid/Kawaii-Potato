exports.run = async (client, message) => {
    m = await message.channel.send("Ping ?");
    m.edit(`Pong ! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
};

exports.info = {
    name: "Ping",
    desc: "If you just wanted to sees my latency.",
    usage: "PatPing",
    type: 1
};