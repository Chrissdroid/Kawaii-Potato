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

/**
 * Gives a selected profile.
 * @param {string} id - An userID of who you want get the profile.
 * @returns {Object} - Returns profile of the targeted User.
 */
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

/** Class representing a log instance for target server. */
class classLog {
    /**
     * Created a new log instance.
     * @param {string} [guild] - Representing a guild id of the targeted server.
     */
    constructor(guild = null) {
        this.guild = guild;
    }

    /**
     * Set a new guild.
     * @param {string} guild - Representing a guild id of the targeted server.
     */
    set guild(guild = null) {
        this.activeGuild = guild;
    }

    /**
     * Send message to console
     * @param {string} title - Title of the logObject
     * @param {string} msg - Message of the logObject
     */
    console(title, msg) {
        console.log(`[${new Date().toLocaleString("en-US")}] => "${title}": "${msg}"\n`);
    }

    /**
     * Create a new log in the guild.
     * @param {(string|Object)} obj - Log content, can be a string or a Discord's RichEmbed fields format
     * @param {string} title - Title of the new log
     * @param {Object} options - Options of the log.
     * @param {string} options.target - userID of a potential targeted user
     * @param {number} options.color - Color used in the embed
     * @param {string} options.show - userID of a potential targeted user
     */
    new(obj, title = "Log", { target: target, color: color, show: show } = {
            target: null,
            color: null,
            show: 'all'
    }) {
        if (typeof obj === 'undefined') throw new Error("Log object undefined");
        let mode = typeof obj === "string" ? true : false;
        if (!mode && obj.fields === 'undefined' || obj.message === 'undefined') throw new Error(`Invalid object format.`);

        const logembed = new Discord.RichEmbed()
            .setTitle(title)
            .setFooter(client.user.tag, client.user.avatarURL)
            .setTimestamp(new Date());

        if (color) logembed.setColor(color);

        if (target && typeof target === 'object') {
            logembed.setAuthor(target.tag, target.avatarURL);
        }

        switch (typeof obj) {
            case 'string':
                logembed.setDescription(obj);
                break;

            case 'object':
                logembed.setDescription(obj.message);

                while (i in obj.fields) {
                    logembed.addField(i.name, i.value, i.inline);
                }
                break;

            default:
                throw new Error(`Invalid object type "${typeof obj}" provided.`);
        }

        switch (show) {

            case 'all':
                const guildSettings = this.activeGuild ? client.settings.get(this.activeGuild.id) : 0;
                if (guildSettings && guildSettings.logsEnabled && client.guilds.get(this.activeGuild.id).channels.some(chan => guildSettings.logChannel === chan.name)) {
                    client
                        .guilds.get(this.activeGuild.id)
                        .channels.find(chan => guildSettings.logChannel === chan.name)
                        .send({ embed: logembed });
                    logembed.setThumbnail(this.activeGuild.iconURL);
                }
                /* falls through */
            case 'DSonly':
                client
                    .guilds.get(client.config.default.guild.id)
                    .channels.get(client.config.default.guild.channels.logs)
                    .send({ embed: logembed });
                /* falls through */
            case 'consoleOnly':
                let ctt = obj;
                if (!mode) ctt = JSON.stringify(obj);
                this.console( title, ctt );
                break;

            default:
                throw new Error(`Unreconized value options.show "${show}" provided.`);

        }
    }
}

client.log = new classLog();

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