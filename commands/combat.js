const Discord = require('discord.js');
const Canvas = require('canvas');

var spacing = 15, avatarformat = 100;

const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - avatarformat * 2 - spacing * 2);

    return ctx.font;
};

exports.run = async (client, message, args) => {
    if (!args.length) return;

    message.channel.startTyping();
    const canvas = Canvas.createCanvas(500, 250);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('./data/img/versus.jpg');
    ctx.drawImage(background, 100, 80, canvas.width * 1.5, canvas.height * 1.5, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#3198bd';
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height - spacing);
    ctx.lineTo(canvas.width - spacing - avatarformat, canvas.height / 2 - spacing / 2);
    ctx.lineTo(spacing * 2 + avatarformat, canvas.height / 2 - spacing / 2);
    ctx.lineTo(spacing, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height - spacing * 2);
    ctx.lineTo(canvas.width - avatarformat, canvas.height / 2 - spacing / 2);
    ctx.lineTo(spacing * 3 + avatarformat, canvas.height / 2 - spacing / 2);
    ctx.lineTo(spacing * 2, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#bd3131';
    ctx.beginPath();
    ctx.moveTo(0, spacing);
    ctx.lineTo(spacing + avatarformat, canvas.height / 2 + spacing / 2);
    ctx.lineTo(canvas.width - spacing * 2 - avatarformat, canvas.height / 2 + spacing / 2);
    ctx.lineTo(canvas.width - spacing, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, spacing * 2);
    ctx.lineTo(avatarformat, canvas.height / 2 + spacing / 2);
    ctx.lineTo(canvas.width - spacing * 3 - avatarformat, canvas.height / 2 + spacing / 2);
    ctx.lineTo(canvas.width - spacing * 2, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#e38030';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';

    ctx.font = applyText(canvas, message.author.username);
    ctx.fillText(message.author.username, canvas.width - spacing * 2 - avatarformat - ctx.measureText(message.author.username).width, spacing + parseInt(ctx.font));

    ctx.font = applyText(canvas, message.member.displayName);
    ctx.fillText(message.member.displayName, spacing * 2 + avatarformat, canvas.height - spacing * 2);

    ctx.beginPath();
    ctx.arc(spacing + avatarformat / 2, canvas.height - avatarformat / 2 - spacing, avatarformat / 2, 0, Math.PI * 2, true);
    ctx.arc(canvas.width - avatarformat / 2 - spacing, spacing + avatarformat / 2, avatarformat / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar1 = await Canvas.loadImage(message.member.user.displayAvatarURL);
    ctx.drawImage(avatar1, spacing, canvas.height - avatarformat - spacing, avatarformat, avatarformat);

    const avatar2 = await Canvas.loadImage(message.member.user.displayAvatarURL);
    ctx.drawImage(avatar2, canvas.width - avatarformat - spacing, spacing, avatarformat, avatarformat);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'versus-image.png');

    message.channel.send(`Started a new combat, ${message.member}!`, attachment).then(() => message.channel.stopTyping());
    // Patcombat start|end
};