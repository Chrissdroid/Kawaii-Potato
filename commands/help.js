const Discord = require('discord.js');

exports.run = async (client, message, args) => {

	let permslvl = 1;

	const modRole = message.guild.roles.find( a => a.name === message.guild.conf.modRole );
	if (modRole && message.member.roles.has(modRole.id)) permslvl = 2;

	const adminRole = message.guild.roles.find( a => a.name === message.guild.conf.adminRole );
	if (adminRole && message.member.roles.has(adminRole.id)) permslvl = 3;

	if (message.author.id === client.config.ownerID) permslvl = 4;

	const helpEmbed = new Discord.RichEmbed()
		.setAuthor('Helping message', client.user.avatarURL)
		.setDescription("*There's my commands list !*")
		.setTimestamp(new Date());

	let chan = message.author, i = 1, footer = 'NormalMode (T1 allowed)', filter = client.commands.get("help");
	switch (permslvl) {
		case 4:
			if (typeof args !== 'undefined' && args[0] === '-dev') {
				chan = message.channel;
			}
			i++;
			if( i === 2 )footer = 'GodMode enabled (T4 allowed)';
		case 3:
			i++;
			if( i === 2 )footer = 'AdminMode enabled (T3 allowed)';
		case 2:
			i++;
			if( i === 2 )footer = 'ModeratorMode enabled (T2 allowed)';
		default:
			helpEmbed.setFooter(footer, message.author.avatarURL)
			filter = client.commands.filter( c => typeof c.info !== 'undefined' && c.info.type <= i ).array();
			break;
	}
	const keep20 = filter.splice(0, 20);
	for(const command of keep20) {
		helpEmbed.addField(`\`T${command.info.type}\` - ${command.info.name}`, `${command.info.desc} \`\`\`css\n${command.info.usage}\`\`\``);
	}
	chan.send({embed: helpEmbed}).then(() => message.react("✅"));
}