const Command = require("../../abstract/command");
const DIG = require("discord-image-generation");
const { AttachmentBuilder } = require('discord.js')

module.exports = class Rip extends Command {
    constructor(...args) {
        super(...args, {
            name: "rip",
            aliases: ["rip"],
            description: "rip a user",
            usage: ["rip <user>"],
            category: "Image",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            options: [
                {
                    name: "user",
                    description: "The user to rip",
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
        const img = await new DIG.Rip().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "rip.png"});
        let embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(`Rip ${member.username}`)
            .setImage("attachment://rip.png")
        let xddata = message.channel.send({ embeds: [embed], files: [attach] });
    }

    async exec({ interaction }) {
        const user = interaction.options.getUser("user") || interaction.user;
        const member = await this.client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Rip().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "rip.png"});
        let embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(`Rip ${member.username}`)
            .setImage("attachment://rip.png")
        await interaction.deferReply();
        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
};