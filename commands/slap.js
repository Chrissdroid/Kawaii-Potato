const Discord = require('discord.js');

exports.run = (client, message, args) => {
	if (args.length < 1) return message.channel.send('- You must mention someone to do this command !', {code: 'md'});

	const conf = {
		"cmdName": "slaps",
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
	if (mentionsUsers.length < 1) return message.channel.send('- You must mention someone to do this command !', {code: 'md'});

	const embed = new Discord.RichEmbed()
		.setFooter(message.author.tag, message.author.avatarURL)
		.setTimestamp(new Date())
		.setColor(conf.color);

	if (mentionsUsers.length >= 2) nbt = 2;
	else nbt = 1;

	const firstUser = mentionsUsers[0];

    if (message.author.id === client.config.ownerID) {
		if (firstUser.id === message.author.id) {
			embed.setDescription(`My creator is slapping himself... you're not THAT stupid but... really sometimes.`);
			embed.setImage(getRandImage("self"));
		}
		else {
			switch (nbt) {
				case 2:
					for (const guildUser of mentionsUsers) {
						multiple.push(` <@${guildUser.id}>`);
					}
					let last = multiple.pop();
					embed.setDescription(`My creator is slapping${multiple.join(',')} and${last}, well... that goes fast.`);
					embed.setImage(getRandImage("multiple"));
					break;
				case 1:
					embed.setDescription(`My creator is slapping <@${firstUser.id}>, ffs why you do that.`);
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
				multiple[getIndex(multiple, 'crea')] = " my stupid creator";
				let last = multiple.pop();
				embed.setDescription(`<@${message.author.id}> is slapping${multiple.join(',')} and${last}, slapping... EVERYONE O-O`);
				embed.setImage(getRandImage("multiple"));
				break;
			case 1:
				embed.setDescription(`<@${message.author.id}> is slapping my stupid creator, he deserve it.`);
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
				embed.setDescription(`<@${message.author.id}> is slapping${multiple.join(',')} and${last}, why are you doing that ?`);
				embed.setImage(getRandImage("multiple"));
				break;
			case 1:
				embed.setDescription(`<@${message.author.id}> is slapping himself. sorry for that. UwU`);
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
					embed.setDescription(`<@${message.author.id}> is slapping${multiple.join(',')} and${last}, why meeeee... ?!`);
					embed.setImage(getRandImage("multiple"));
					break;
				case 1:
					embed.setDescription(`<@${message.author.id}> is slapping me, what i did wrong ? TwT`);
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
					multiple[0] = ` my not-loved ${multiple[0]}`;
					let last = multiple.pop();
					embed.setDescription(`<@${message.author.id}> is slapping${multiple.join(',')} and${last}, robots sucks. i'm better than us >:c`);
					embed.setImage(getRandImage("multiple"));
					break;
				case 1:
					embed.setDescription(`<@${message.author.id}> has slapping <@${firstUser.id}> a stupid robot. Fault of his code.`);
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
				embed.setDescription(`<@${message.author.id}> is slapping${multiple.join(',')} and${last}, that a lot of mad mens !`);
				embed.setImage(getRandImage("multiple"));
				break;
			case 1:
				embed.setDescription(`<@${message.author.id}> is slapping <@${firstUser.id}>, well. You needed to be punish.`);
				embed.setImage(getRandImage("normal"));
				break;
		}
	}

	message.channel.send({embed: embed});
}

exports.info = {
	name: "Slap",
	desc: "If you want to punish someone, you can ! >:3",
	usage: "PatSlap Mention[ ...Mentions]",
	type: 1
}