const Command = require("../../abstract/command");
const DIG = require("discord-image-generation");
const { AttachmentBuilder } = require('discord.js')

module.exports = class Triggered extends Command {
    constructor(...args) {
        super(...args, {
            name: "triggered",
            aliases: ["trigger"],
            description: "trigger a user",
            usage: ["triggered <user>"],
            category: "Image",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            options: [
                {
                    name: "user",
                    description: "The user to trigger",
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
        const img = await new DIG.Triggered().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "triggered.gif"});
        let embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(`Triggered ${member.username}`)
            .setImage("attachment://triggered.gif")
        let xddata = message.channel.send({ embeds: [embed], files: [attach] });
    }

    async exec({ interaction }) {
        const user = interaction.options.getUser("user") || interaction.user;
        const member = await this.client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Triggered().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "triggered.gif"});
        let embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(`Triggered ${member.username}`)
            .setImage("attachment://triggered.gif")
        await interaction.deferReply();
        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
}