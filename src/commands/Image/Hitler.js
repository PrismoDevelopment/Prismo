const Command = require("../../abstract/command");
const DIG = require("discord-image-generation");
const { AttachmentBuilder } = require('discord.js')

module.exports = class Hitler extends Command {
    constructor(...args) {
        super(...args, {
            name: "hitler",
            aliases: ["worstpresident"],
            description: "hitler a user",
            usage: ["hitler <user>"],
            category: "Image",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            options: [
                {
                    name: "user",
                    description: "The user to hitlerify",
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
        const img = await new DIG.Hitler().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "hitler.png"});
        let embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(`Hitler ${member.username}`)
            .setImage("attachment://hitler.png")
        let xddata = message.channel.send({ embeds: [embed], files: [attach] });
    }

    async exec({ interaction }) {
        const user = interaction.options.getUser("user") || interaction.user;
        const member = await this.client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Hitler().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "hitler.png"});
        let embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(`Hitler ${member.username}`)
            .setImage("attachment://hitler.png")
        await interaction.deferReply();
        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
};
