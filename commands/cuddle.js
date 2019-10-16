const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if (args.length < 1) return message.channel.send('- You must mention someone to do this command !', { code: 'md' });

    const conf = {
        "cmdName": "cuddles",
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
            embed.setDescription(`My creator is cuddling himself... i'm traumatized`);
            embed.setImage(getRandImage("self"));
        }
        else {
            switch (nbt) {
                case 2:
                    for (const guildUser of mentionsUsers) {
                        multiple.push(` <@${guildUser.id}>`);
                    }
                    let last = multiple.pop();
                    embed.setDescription(`My creator is cuddling${multiple.join(',')} and${last}, soo cute ! OwO`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`My creator is cuddling <@${firstUser.id}>, i'm so jealous... UwU`);
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
                embed.setDescription(`<@${message.author.id}> is cuddling${multiple.join(',')} and${last}, don't move, i'll take a picture of this !`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> is cuddling my creator, take care of him !`);
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
                embed.setDescription(`<@${message.author.id}> is cuddling${multiple.join(',')} and${last}, oooookay... ?`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> is cuddling himself. pillows will be our new best friends`);
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
                    embed.setDescription(`<@${message.author.id}> is cuddling${multiple.join(',')} and${last}, yeeee, cuddles ! for everones !`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`<@${message.author.id}> is cuddling me !!! it's a dream !`);
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
                    embed.setDescription(`<@${message.author.id}> is cuddling${multiple.join(',')} and${last}, robots are more userfull than humans, everyones know.`);
                    embed.setImage(getRandImage("multiple"));
                    break;
                case 1:
                    embed.setDescription(`<@${message.author.id}> is cuddling <@${firstUser.id}> the robot... why not me... i'm better than him ! TwT`);
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
                embed.setDescription(`<@${message.author.id}> is cuddling${multiple.join(',')} and${last}, that a lot of cuddles !`);
                embed.setImage(getRandImage("multiple"));
                break;
            case 1:
                embed.setDescription(`<@${message.author.id}> is cuddling <@${firstUser.id}>, how cute :3`);
                embed.setImage(getRandImage("normal"));
                break;
        }
    }

    message.channel.send({ embed: embed });
};

exports.info = {
    name: "Cuddle",
    desc: "Cuddle the bests persons in this world !",
    usage: "PatCuddle Mention[ ...Mentions]",
    type: 1
};