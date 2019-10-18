exports.run = (client, message, [title, ...args]) => {
    if (message.author.id !== client.config.ownerID) return;
    if (typeof title === 'undefined' || !args.length) return; 

    client.log.new(args.join(' '), title);
};