const Discord = require('discord.js');
const Enmap = require("enmap");
const fs = require("fs");

const client = new Discord.Client();
client.config = require('./config.json');
client.token = require('./token/access.json');

client.commands = new Enmap({name: "commands"});
client.profiles = new Enmap({name: "profiles"});
client.items = new Enmap({name: "items"});
client.awaitcmd = new Enmap({
	name: "awaitcmd",
	fetchAll: false,
	autoFetch: true,
	cloneLevel: 'deep'
});
client.awaitcmd.deleteAll();
client.settings = new Enmap({
	name: "settings",
	fetchAll: false,
	autoFetch: true,
	cloneLevel: 'deep'
});
client.items.ensure(1, {
	name: 'Cookie',
	description: 'Just a simple cookie !',
	value: 25
});

client.profile = (id) => {
	if (typeof id === 'undefined') return;
	const defaultProfile = {
		xp: 0,
		level: 1,
		coins: 150,
		inv: [
			{
				id: 1,
				count: 1
			}
		]
	};

	const active = client.profiles.ensure(id, defaultProfile);
	let i = 0;
	for (const item of active.inv) {
		item.name = client.items.get(item.id, "name");
		i++;
	}

	const sorted = active.inv.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
	});

	active.inv = sorted;

	return active;
};

client.log = (obj, title = "Log", guild, target, unique = false) => {

    const logembed = new Discord.RichEmbed()
        .setTitle(title)
        .setFooter(client.user.tag, client.user.avatarURL)
        .setTimestamp(new Date());

    if (unique === true) {
        if (typeof obj === "string") {
            console.log(`[${timeToString()}] => "${title}": "${obj}"\n`);
        }
        else if (typeof obj === "object") {
            console.log(`[${timeToString()}] => "${title}": "${JSON.stringify(obj)}"\n`);
        }
        else return console.log("ERR : obj to log undefined.");
    }
    else {
        if (typeof obj === "string") {

            if (typeof target === 'object') {
                logembed.setAuthor(target.tag, target.avatarURL);
            }

            logembed.setDescription(obj);

            console.log(`[${timeToString()}] => "${title}": "${obj}"`);

            const guildSettings = guild ? client.settings.get(guild.id) : 0;
            if (guildSettings && guildSettings.logsEnabled && client.guilds.get(guild.id).channels.find(name => guildSettings.logChannel = name)) {
                client
                    .guilds.get(guild.id)
                    .channels.find(name => guildSettings.logChannel = name)
                    .send({ embed: logembed });
                logembed.setThumbnail(guild.iconURL);
            }

            client
                .guilds.get(client.config.default.guild.id)
                .channels.get(client.config.default.guild.channels.logs)
                .send({ embed: logembed });
        }
        else if (typeof obj === "object") {
            if (typeof target === 'object') {
                logembed.setAuthor(target.tag, target.avatarURL);
            }

            logembed.setDescription(obj.message);

            console.log(`[${timeToString()}] => "${title}": "${JSON.stringify(obj)}"\n`);

            while (i in obj.fields) {
                logembed.addField(i.name, i.value, i.inline);
            }

            const guildSettings = client.settings.get(guild.id);
            if (guildSettings && guildSettings.logsEnabled && client.guilds.get(guild.id).channels.find(name => guildSettings.logChannel = name)) {
                client
                    .guilds.get(guild.id)
                    .channels.find(name => guildSettings.logChannel = name)
                    .send({ embed: logembed });
                logembed.setThumbnail(guild.iconURL);
            }

            client
                .guilds.get(client.config.default.guild.id)
                .channels.get(client.config.default.guild.channels.logs)
                .send({ embed: logembed });
        }
        else throw new Error("obj to log undefined.");
    }
};


class classLog {
	constructor(guild) {
		this.activeGuild = guild;
	}

	static send(obj, title = "Log", target = null, unique = false) {
		const logembed = new Discord.RichEmbed()
			.setTitle(title)
			.setFooter(client.user.tag, client.user.avatarURL)
			.setTimestamp(new Date());

		if (unique === true) {
			if (typeof obj === "string") {
				console.log(`[${timeToString()}] => "${title}": "${obj}"\n`);
			}
			else if (typeof obj === "object") {
				console.log(`[${timeToString()}] => "${title}": "${JSON.stringify(obj)}"\n`);
			}
			else return console.log("ERR : obj to log undefined.");
		}
		else {
			if (typeof obj === "string") {

				if (typeof target === 'object') {
					logembed.setAuthor(target.tag, target.avatarURL);
				}

				logembed.setDescription(obj);

				console.log(`[${timeToString()}] => "${title}": "${obj}"`);

				const guildSettings = this.activeGuild ? client.settings.get(this.activeGuild.id) : 0;
				if (guildSettings && guildSettings.logsEnabled && client.guilds.get(this.activeGuild.id).channels.find(name => guildSettings.logChannel = name)) {
					client
						.guilds.get(this.activeGuild.id)
						.channels.find(name => guildSettings.logChannel = name)
						.send({embed : logembed});
					logembed.setThumbnail(guild.iconURL);
				}

				client
					.guilds.get(client.config.default.guild.id)
					.channels.get(client.config.default.guild.channels.logs)
					.send({embed : logembed});
			}
			else if (typeof obj === "object") {
				if (typeof target === 'object') {
					logembed.setAuthor(target.tag, target.avatarURL);
				}

				logembed.setDescription(obj.message);

				console.log(`[${timeToString()}] => "${title}": "${JSON.stringify(obj)}"\n`);

				while (i in obj.fields) {
					logembed.addField(i.name, i.value, i.inline);
				}

				const guildSettings = client.settings.get(guild.id);
				if (guildSettings && guildSettings.logsEnabled && client.guilds.get(guild.id).channels.find(name => guildSettings.logChannel = name)) {
					client
						.guilds.get(guild.id)
						.channels.find(name => guildSettings.logChannel = name)
						.send({embed : logembed});
					logembed.setThumbnail(guild.iconURL).then(msg => this.previousMsg = {message: msg, embed: logembed});
				}

				client
					.guilds.get(client.config.default.guild.id)
					.channels.get(client.config.default.guild.channels.logs)
					.send({embed : logembed});
			}
			else throw new Error("obj to log undefined.");
		}
	}

	static modify(obj, title = "Log", adding = true) {
		if (!this.previousMsg) return this.send(obj, title)
	}
}


function timeToString(date = new Date()) {
	return date.toLocaleString("en-US");
}

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
	});
});

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let props = require(`./commands/${file}`);
		let commandName = file.split(".")[0];
		console.log(`Chargement de la commande '${commandName}'`);
		client.commands.set(commandName, props);
	});
});

client.login(client.token.token);