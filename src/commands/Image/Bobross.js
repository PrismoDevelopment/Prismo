const Command = require("../../abstract/command");
const DIG = require("discord-image-generation");
const { AttachmentBuilder } = require('discord.js')

module.exports = class Bobross extends Command {
    constructor(...args) {
        super(...args, {
            name: "bobross",
            aliases: ["bobross"],
            description: "bobross a user",
            usage: ["bobross <user>"],
            category: "Image",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            options: [
                {
                    name: "user",
                    description: "The user to bobross",
                    type: 6,
                    required: false,
                },
            ],
        });
    }

    async run({ message, args }) {
        const user = args[0] ? await this.client.util.userQuery(args[0]) : message.author;
        const member = await this.client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Bobross().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "bobross.png"});
        let embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(`Bobross ${member.username}`)
            .setImage("attachment://bobross.png")
        let xddata = message.channel.send({ embeds: [embed], files: [attach] });
    }

    async exec({ interaction }) {
        const user = interaction.options.getUser("user") || interaction.user;
        const member = await this.client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Bobross().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "bobross.png"});
        let embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(`Bobross ${member.username}`)
            .setImage("attachment://bobross.png")
        await interaction.deferReply();
        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
};