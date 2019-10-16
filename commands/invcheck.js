exports.run = (client, message, [target, ...args]) => {
    if (message.author.id !== client.config.ownerID) return;

    let user = message.mentions.members.first() || client.users.get(target);
    if (!user) user = message.author;

    message.channel.send(JSON.stringify(client.profile(user.id)));
};

exports.info = {
    name: "Inventory Check",
    desc: "Debug mode for inventory checking.",
    usage: "PatInvcheck [userID|mention]",
    type: 4
};