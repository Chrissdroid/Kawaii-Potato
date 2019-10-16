const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if (args.length < 1) return message.channel.send('- You must mention someone to do this command !', { code: 'md' });

    const conf = {
        "cmdName": "nukes",
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
            embed.setDescription(`My creator has nuked himself... and who pay for hospitalisation ?!`);
            embed.setImage(getRandImage("self"));
        }
        else {
            switch (nbt) {
                case 2:
                    for (const guildUser of mentionsUsers) {
                        multiple.push(` <@${guildUser.id}>`);
                    }
                    let last = multiple.pop();
                    embed.setDescription(`My creator has nuked${multiple.join(',')} and${last}, and everyone dies. horribly.`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`My creator has nuked <@${firstUser.id}>, where do you get that power ?`);
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
                multiple[getIndex(multiple, 'crea')] = " my dumb creator";
                let last = multiple.pop();
                embed.setDescription(`<@${message.author.id}> has nuked${multiple.join(',')} and${last}, time to nuke ! O-O`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> has nuked my dumb creator, he deserve it. everytime.`);
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
                embed.setDescription(`<@${message.author.id}> has nuked${multiple.join(',')} and${last}, okay, that cost some lives here`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> has nuked himself. suicide is not a good choice...`);
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
                    embed.setDescription(`<@${message.author.id}> has nuked${multiple.join(',')} and${last}, I'm too young to die !`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`<@${message.author.id}> has nuked me, well. that's not fair.`);
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
                    multiple[0] = ` my desperately not-loved ${multiple[0]}`;
                    let last = multiple.pop();
                    embed.setDescription(`<@${message.author.id}> has nuked${multiple.join(',')} and${last}, IA are better.`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`<@${message.author.id}> has nuked <@${firstUser.id}> and we'll didn't remember him`);
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
                multiple[getIndex(multiple, 'crea')] = " my stupid creator";
                let last = multiple.pop();
                embed.setDescription(`<@${message.author.id}> has nuked${multiple.join(',')} and${last}, that a lot destruction here.`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> has nuked <@${firstUser.id}>, BOOM !`);
                embed.setImage(getRandImage("normal"));
                break;
        }
    }

    message.channel.send({ embed: embed });
};

exports.info = {
    name: "Nuke",
    desc: "It's over 9000 ! OwO",
    usage: "PatNuke Mention[ ...Mentions]",
    type: 1
};