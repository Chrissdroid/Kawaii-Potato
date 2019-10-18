const Discord = require('discord.js');
const optxp = new Set();

getRandomInteger = (min = 0, max = 20) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

timeToString = (date = new Date()) => {
    return date.toLocaleString("en-US");
};

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;

    defaultSettings = {
        xpEnabled: true,
        logsEnabled: false,
        logChannel: "mod-log",
        modRole: "Moderator",
        adminRole: "Administrator"
    };
    
    message.guild.conf = client.settings.ensure(message.guild.id, defaultSettings);
    client.log.guild = message.guild;

    if (message.guild.conf.xpEnabled) {
        const key = message.author.id;
        client.profile(key);

        if (!optxp.has(key)) {
            optxp.add(key);
            client.profiles.math(key, "+", getRandomInteger(5, 15), "xp");
            setTimeout(() => {
                optxp.delete(key);
            }, 60000);
        }
        const curLevel = Math.floor(0.1 * Math.sqrt(client.profiles.get(key, "xp")));
        let OneUP = false, lvlups = client.profiles.get(key, "level");
        while (lvlups < curLevel) {
            lvlups++;
            OneUP = true;
        }
        if (OneUP) {
            client.profiles.set(key, curLevel, "level");
            const lvlembed = new Discord.RichEmbed()
                .setTitle("level Up !")
                .setDescription(`You're now level ${curLevel}, gg !`)
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setColor(3514045);
            message.channel.send({ embed: lvlembed });
        }
    }

    if (message.content.toLowerCase().indexOf(client.config.prefix) !== 0) return;
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    if (!cmd) return;

    client.awaitcmd.ensure(message.author.id, { LoT: 0 });
    switch (client.awaitcmd.get(message.author.id, "LoT")) {
        case 0:
            client.awaitcmd.inc(message.author.id, "LoT");
            break;

        case 1:
            client.awaitcmd.inc(message.author.id, "LoT");
            mwait = await message.channel.send({ embed: {
                title: 'Spam alert',
                description: '- Command in cooldown, please wait...',
                image: {
                    url: 'https://images-na.ssl-images-amazon.com/images/I/61n0DJPiclL.jpg'
                }
            }});
            return;

        default:
            return;
    }
    setTimeout(() => {
        client.awaitcmd.delete(message.author.id);
        if (typeof mwait !== 'undefined') mwait.delete().catch(O_o=>{});
    }, 5000);

    console.log(`- command "${command}" executed by ${message.author.tag}`);
    cmd.run(client, message, args);
};