const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if (args.length < 1) return message.channel.send('- You must mention someone to do this command !', { code: 'md' });

    const conf = {
        "cmdName": "hugs",
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
            embed.setDescription(`My creator has just hugged himself... You're so an selfish master.`);
            embed.setImage(getRandImage("self"));
        }
        else {
            switch (nbt) {
                case 2:
                    for (const guildUser of mentionsUsers) {
                        multiple.push(` <@${guildUser.id}>`);
                    }
                    let last = multiple.pop();
                    embed.setDescription(`My creator has hugged${multiple.join(',')} and${last}, avengers assemble !`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`My creator has hugged <@${firstUser.id}>, he does that with everyone. UwU`);
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
                embed.setDescription(`<@${message.author.id}> has hugged${multiple.join(',')} and${last} like a beautifull family !`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> has hugged my creator, i think he will hug you back ! :3`);
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
                embed.setDescription(`<@${message.author.id}> has hugged${multiple.join(',')} and${last}, how can you do that ?!`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> has hugged himself. yes. himself.`);
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
                    embed.setDescription(`<@${message.author.id}> has hugged${multiple.join(',')} and${last}, i'm happy but... i wanted that just for me !`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`<@${message.author.id}> has hugged me ! I'm sooo happy ! :3`);
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
                    multiple[0] = ` my fellow ${multiple[0]}`;
                    let last = multiple.pop();
                    embed.setDescription(`<@${message.author.id}> has hugged${multiple.join(',')} and${last}, you like robots now ? that's new.`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`<@${message.author.id}> has hugged <@${firstUser.id}> the bot, I'm better. I'm always better than that... "thing". >:c`);
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
                embed.setDescription(`<@${message.author.id}> has hugged${multiple.join(',')} and${last}, they'll be together this time !`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> has hugged vigorously <@${firstUser.id}> ! OwO`);
                embed.setImage(getRandImage("normal"));
                break;
        }
    }

    message.channel.send({ embed: embed });
};

exports.info = {
    name: "Hug",
    desc: "Give a hug to someone, it's free !",
    usage: "PatHug Mention[ ...Mentions]",
    type: 1
};