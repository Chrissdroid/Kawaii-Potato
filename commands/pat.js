const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if (args.length < 1) return message.channel.send('- You must mention someone to do this command !', { code: 'md' });

    const conf = {
        "cmdName": "pats",
        "color": 8738969
    }

    getRandImage = (target) => {
        return client.config[conf.cmdName][target][Math.floor(Math.random() * client.config[conf.cmdName][target].length)];
    }

    removeDuplicates = (arr = []) => {
        return [...new Set(arr)];
    }
    args = removeDuplicates(args);

    getUser = (mtn) => {
        const matches = mtn.match(/^<@!?(\d+)>$/);
        if (!matches) return;

        const id = matches[1];

        return client.users.get(id);
    }

    getIndex = (obj = [], type = 'self') => {
        switch (type) {
            case "self":
                return obj.findIndex(x => x.includes(message.author.id));

            case "crea":
                return obj.findIndex(x => x.includes(client.config.ownerID));

            case "me":
                return obj.findIndex(x => x.includes(client.user.id));
        }
    }

    let mentionsUsers = [], image, nbt, multiple = [];
    for (const user of args) {
        mentionsUsers.push(getUser(user));
    }
    if (mentionsUsers.length < 1) return message.channel.send('- You must mention someone to do this command !', { code: 'md' });

    const embed = new Discord.RichEmbed()
        .setFooter(message.author.tag, message.author.avatarURL)
        .setTimestamp(new Date())
        .setColor(conf.color);

    if (mentionsUsers.length >= 2) nbt = 2;
    else nbt = 1;

    const firstUser = mentionsUsers[0];

    if (message.author.id === client.config.ownerID) {
        if (firstUser.id === message.author.id) {
            embed.setDescription(`My creator has pat himself... ***thinking***`);
            embed.setImage(getRandImage("self"));
        }
        else {
            switch (nbt) {
                case 2:
                    for (const guildUser of mentionsUsers) {
                        multiple.push(` <@${guildUser.id}>`);
                    }
                    let last = multiple.pop();
                    embed.setDescription(`My creator has pats${multiple.join(',')} and${last}, so, everyones get's a pat !`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`My creator has pat <@${firstUser.id}>, he pats, i pats, does everyones pats ?`);
                    embed.setImage(getRandImage("normal"));
                    break;
            }
        }
    }
    else if (firstUser.id === client.config.ownerID) {
        switch (nbt) {
            case 2:
                for (const guildUser of mentionsUsers) {
                    multiple.push(` <@${guildUser.id}>`);
                }
                multiple[getIndex(multiple, 'crea')] = " my creator";
                let last = multiple.pop();
                embed.setDescription(`<@${message.author.id}> has pats${multiple.join(',')} and${last}, don't move, this is a beautifull moment :3`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> has pat my creator, i think this is mean to close your mouth, baka >:3`);
                embed.setImage(getRandImage("normal"));
                break;
        }
    }
    else if (firstUser.id === message.author.id) {
        switch (nbt) {
            case 2:
                for (const guildUser of mentionsUsers) {
                    multiple.push(` <@${guildUser.id}>`);
                }
                multiple[getIndex(multiple)] = " him";
                let last = multiple.pop();
                embed.setDescription(`<@${message.author.id}> has pats${multiple.join(',')} and${last}, if you want then, do it`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> has pat himself. this, is selfish.`);
                embed.setImage(getRandImage("self"));
                break;
        }
    }
    else if (firstUser.bot) {
        if (firstUser.id === client.user.id) {
            switch (nbt) {
                case 2:
                    for (const guildUser of mentionsUsers) {
                        multiple.push(` <@${guildUser.id}>`);
                    }
                    multiple[getIndex(multiple, 'me')] = ` me`;
                    let last = multiple.pop();
                    embed.setDescription(`<@${message.author.id}> has pats${multiple.join(',')} and${last}, pats... who don't wants pats ? \*-\*`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`<@${message.author.id}> has pat me and i'm okay with this !`);
                    embed.setImage(getRandImage("normal"));
                    break;
            }
        }
        else {
            switch (nbt) {
                case 2:
                    for (const guildUser of mentionsUsers) {
                        multiple.push(` <@${guildUser.id}>`);
                    }
                    multiple[0] = ` my dear ${multiple[0]}`;
                    let last = multiple.pop();
                    embed.setDescription(`<@${message.author.id}> has pats${multiple.join(',')} and${last}, carefull, you can broke his systems, if it's not already done`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`<@${message.author.id}> has pat <@${firstUser.id}> why you can't just slap him, it's more efficient !`);
                    embed.setImage(getRandImage("normal"));
                    break;
            }
        }
    }
    else {
        switch (nbt) {
            case 2:
                for (const guildUser of mentionsUsers) {
                    multiple.push(` <@${guildUser.id}>`);
                }
                multiple[getIndex(multiple, 'crea')] = " my creator";
                let last = multiple.pop();
                embed.setDescription(`<@${message.author.id}> has pats${multiple.join(',')} and${last}, ${message.author.username} is justice.`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> has pat <@${firstUser.id}>, how cute :3`);
                embed.setImage(getRandImage("normal"));
                break;
        }
    }

    message.channel.send({ embed: embed });
};

exports.info = {
    name: "Patpat",
    desc: "The best form of attention in the world OwO",
    usage: "PatPat Mention[ ...Mentions]",
    type: 1
};