const token = require('../token/access.json');

exports.run = (client, message) => {
    if (message.author.id !== client.config.ownerID) return;

    message.channel.send('Rebooting...')
        .then(msg => client.destroy()
            .then(() => client.login(token.token)
                .then(() => msg.edit('Reboot done !'))
            )
        );
};

exports.info = {
    name: "Reboot",
    desc: "Rebooting device !",
    usage: "PatReboot",
    type: 4
};