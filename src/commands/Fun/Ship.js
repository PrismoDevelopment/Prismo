const Command = require("../../abstract/command");
const { AttachmentBuilder } = require('discord.js')
const Canvas = require('canvas')
module.exports = class Ship extends Command {
    constructor(...args) {
        super(...args, {
            name: "ship",
            aliases: ["ship"],
            description: "Ship two users",
            category: "Fun",
            usage: ["ship <user1> <user2>"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            options: [
                {
                    name: "user1",
                    description: "The first user",
                    type: 6,
                    required: true,
                },
                {
                    name: "user2",
                    description: "The second user",
                    type: 6,
                    required: true,
                },
            ],
        });
    }
    async run({ message, args }) {
        let member = args[0] ? await this.client.util.userQuery(args[0]) : null;
        let member2 = args[1] ? await this.client.util.userQuery(args[1]) : null;
        if (!member) return message.channel.send("Please provide a user to ship with");
        if (!member2) return message.channel.send("Please provide a second user to ship with");
        const user1 = await this.client.users.fetch(member);
        const user2 = await this.client.users.fetch(member2);
        const love = Math.floor(Math.random() * 100) + 1;
        const image = await this.genImage(user1, user2, love);
        const attach = new AttachmentBuilder(image, {name: "ship.png"});
        const embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setImage("attachment://ship.png")
            .setTimestamp()
            .setFooter({text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic: true})});
        if (love >= 50) {
            embed.setTitle(`${user1.username} and ${user2.username} are ${love}% in love! Maybe they should date?`);
        } else {
            embed.setTitle(`${user1.username} and ${user2.username} are ${love}% in love! Maybe they should just be friends?`);
        }
        message.reply({ embeds: [embed], files: [attach] });
    }

    async genImage(user1, user2, love) {
        const user1avatar = user1.displayAvatarURL({ format: "png", size: 512 });
        const user2avatar = user2.displayAvatarURL({ format: "png", size: 512 });
        const heart = await Canvas.loadImage('https://cdn.discordapp.com/attachments/716216765448978504/858607217728159744/unknown.png')
        const broken = await Canvas.loadImage('https://cdn.discordapp.com/attachments/716216765448978504/858607537238179840/unknown.png')
        const user1avatarpng = user1avatar.replace("webp", "png");
        const user2avatarpng = user2avatar.replace("webp", "png");
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        let backgrounds = ["https://i.imgur.com/EgVLOTQ.jpg", "https://i.imgur.com/7ZKMDQa.jpg", "https://i.imgur.com/Zt9m1rm.jpg", "https://i.imgur.com/04G7um6.jpg", "https://i.imgur.com/YOQW66q.jpg"]
        let randombg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        const background = await Canvas.loadImage(randombg);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        if (love >= 50) {
            ctx.drawImage(heart, 275, 60, 150, 150)
        } else {
            ctx.drawImage(broken, 275, 60, 150, 150)
        }
        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#ffffff'; 
        ctx.fillText(`${love}%`, 305, 150);
        ctx.beginPath();
        ctx.arc(175, 125, 100, 0, Math.PI * 2, true);
        ctx.arc(525, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar1 = await Canvas.loadImage(user1avatarpng);
        ctx.drawImage(avatar1, 75, 25, 200, 200)
        const avatar2 = await Canvas.loadImage(user2avatarpng);
        ctx.drawImage(avatar2, 425, 25, 200, 200)
        return canvas.toBuffer();
    }

    async execute({ interaction }) {
        const user1 = interaction.options.getUser("user1");
        const user2 = interaction.options.getUser("user2");
        const love = Math.floor(Math.random() * 100) + 1;
        const image = await this.genImage(user1, user2, love);
        const attach = new AttachmentBuilder(image, {name: "ship.png"});
        const embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setImage("attachment://ship.png")
            .setTimestamp()
            .setFooter({text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})});
        if (love >= 50) {
            embed.setTitle(`${user1.username} and ${user2.username} are ${love}% in love! Maybe they should date?`);
        } else {
            embed.setTitle(`${user1.username} and ${user2.username} are ${love}% in love! Maybe they should just be friends?`);
        }
        interaction.reply({ embeds: [embed], files: [attach] });
    }
}