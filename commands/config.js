exports.run = (client, message, [prop, ...value]) => {

    const adminRole = message.guild.roles.find(role => role.name === message.guild.conf.adminRole);

    const set = value[0];
    const target = typeof prop !== 'undefined' ? prop.toLowerCase() : null;

    if (message.author.id === client.config.ownerID || (adminRole && message.member.roles.has(adminRole.id))) {
        switch (target) {
            case "adminrole":
                if (message.author.id !== client.config.ownerID) return message.reply("You're not the owner of this guild, sorry!");
                if (!set) return message.reply(`The adminRole is currently "${message.guild.conf.adminRole}" if you want to change it, give the targeted role name next to this command.`);
                client.settings.set(message.guild.id, value.join(" "), "adminRole");
                message.channel.send(`Guild configuration AdminRole has been changed to:\n\`${value.join(" ")}\``);
                break;

            case "modrole":
                if (!set) return message.reply(`The modRole is currently "${message.guild.conf.modRole}" if you want to change it, give the targeted role name next to this command.`);
                client.settings.set(message.guild.id, value.join(" "), "modRole");
                message.channel.send(`Guild configuration ModRole has been changed to:\n\`${value.join(" ")}\``);
                break;

            case "xp":
            case "xpenabled":
                if (!set) return message.reply(`The xp system is currently "${message.guild.conf.xpEnabled}" if you want to change it, type "on" or "off" next to this command.`);
                switch (set) {
                    case "y":
                    case "ye":
                    case "on":
                    case "yes":
                    case "true":
                    case "enable":
                        client.settings.set(message.guild.id, true, "xpEnabled");
                        message.channel.send(`Guild configuration xpEnabled has been changed to:\n\`true\``);
                        break;

                    case "no":
                    case "off":
                    case "nope":
                    case "false":
                    case "disable":
                        client.settings.set(message.guild.id, false, "xpEnabled");
                        message.channel.send(`Guild configuration xpEnabled has been changed to:\n\`false\``);
                        break;
                }
                break;

            case "log":
            case "logenabled":
            case "logs":
            case "logsenabled":
                if (!set) return message.reply(`The logs system is currently "${message.guild.conf.logsEnabled}" if you want to change it, type "on" or "off" next to this command.`);
                switch (set) {
                    case "y":
                    case "ye":
                    case "on":
                    case "yes":
                    case "true":
                    case "enable":
                        client.settings.set(message.guild.id, true, "logsEnabled");
                        message.channel.send(`Guild configuration logsEnabled has been changed to:\n\`true\``);
                        break;

                    case "no":
                    case "off":
                    case "nope":
                    case "false":
                    case "disable":
                        client.settings.set(message.guild.id, false, "logsEnabled");
                        message.channel.send(`Guild configuration logsEnabled has been changed to:\n\`false\``);
                        break;
                }
                break;

            case "logchannel":
            case "logschannel":
                if (!set) return message.reply(`The logs channel is currently "${message.guild.conf.logChannel}" if you want to change it, type the channel name next to this command.`);
                client.settings.set(message.guild.id, value.join(" "), "logChannel");
                message.channel.send(`Guild configuration logChannel has been changed to:\n\`${value.join(" ")}\``);
                break;

            default:
                let configProps = Object.keys(message.guild.conf).map(prop => {
                    return `\n${prop} :  ${message.guild.conf[prop]} ( ${typeof message.guild.conf[prop]} )`;
                });
                message.channel.send(`The following are the server's current configuration:\`\`\`json${configProps}\`\`\``);
                break;
        }
    }
    else {
        return message.reply("You're not an admin, sorry!");
    }
};

exports.info = {
    name: "Config",
    desc: "Edit the settings of the guild",
    usage: "PatConfig[ adminRole|modRole|logsChannel|xp|logs][ roleName|channelName|boolean]",
    type: 3
};