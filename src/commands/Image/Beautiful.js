const Command = require("../../abstract/command");
const DIG = require("discord-image-generation");
const { AttachmentBuilder } = require('discord.js')

module.exports = class Beautiful extends Command {
    constructor(...args) {
        super(...args, {
            name: "beautiful",
            aliases: ["beautiful"],
            description: "beautiful a user",
            usage: ["beautiful <user>"],
            category: "Image",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            options: [
                {
                    name: "user",
                    description: "The user to beautiful",
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
        const img = await new DIG.Beautiful().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "beautiful.png"});
        let embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(`Beautiful ${member.username}`)
            .setImage("attachment://beautiful.png")
        let xddata = message.channel.send({ embeds: [embed], files: [attach] });
    }

    async exec({ interaction }) {
        const user = interaction.options.getUser("user") || interaction.user;
        const member = await this.client.users.fetch(user);
        let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
        let pngavatar = avatar.replace("webp", "png");
        const img = await new DIG.Beautiful().getImage(pngavatar);
        const attach = new AttachmentBuilder(img, {name: "beautiful.png"});
        let embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(`Beautiful ${member.username}`)
            .setImage("attachment://beautiful.png")
        await interaction.deferReply();
        await interaction.editReply({ embeds: [embed], files: [attach] });
    }
};