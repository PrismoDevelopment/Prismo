const Command = require("../../abstract/command");
const { listenerCount } = require("../../models/guildData");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "banner",
            aliases: ["banner"],
            description: "Shows the banner of the mentioned user.",
            usage: ["banner <user>"],
            category: "Utilities",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The user to show the avatar of.",
                    required: false,
                },
            ],
        });
    }
    async run({ message, args }) {
        let member = args[0]
            ? await this.client.util.userQuery(args[0]) : message.author.id;
        if (!member)
            return message.channel.send({
                content: "I couldn't find that user.",
            });
        const banner = await this.client.util.getBanner(member);
        if (!banner)
            return message.channel.send({
                content: "This user doesn't have a banner.",
            });
        let user = await this.client.users.fetch(member);
        let embed = this.client.util
            .embed()
            .setTitle(`${user.username}'s Banner`)
            .setImage(banner)
            .setColor(this.client.config.Client.PrimaryColor);
        const compos = [
            {
                type: 2,
                style: 5,
                label: "JPEG",
                url: banner.replace("webp", "jpeg"),
            },
            {
                type: 2,
                style: 5,
                label: "PNG",
                url: banner.replace("webp", "png"),
            },
        ];
        if (banner.includes("a_")) {
            compos.push({
                type: 2,
                style: 5,
                label: "GIF",
                url: banner.replace("webp", "gif"),
            });
        }

        message.channel.send({
            embeds: [embed],
            components: [{ type: 1, components: compos }],
        });
    }

    async exec({ interaction, args }) {
        let member = interaction.options.get("user")
            ? interaction.options.get("user").user
            : interaction.user;
        if (!member)
            return interaction.reply({ content: "I couldn't find that user." });
        const banner = await member
            .fetch()
            .then((u) => u.bannerURL({ dynamic: true, size: 2048 }));
        if (!banner)
            return interaction.reply({
                content: "That user doesn't have a banner.",
            });
        let embed = this.client.util
            .embed()
            .setTitle(`${member.username}'s Banner`)
            .setImage(banner)
            .setColor(this.client.config.Client.PrimaryColor);
        const compos = [
            {
                type: 2,
                style: 5,
                label: "JPEG",
                url: banner.replace("webp", "jpeg"),
            },
            {
                type: 2,
                style: 5,
                label: "PNG",
                url: banner.replace("webp", "png"),
            },
        ];
        if (banner.includes("a_")) {
            compos.push({
                type: 2,
                style: 5,
                label: "GIF",
                url: banner.replace("webp", "gif"),
            });
        }

        interaction.reply({
            embeds: [embed],
            components: [{ type: 1, components: compos }],
        });
    }
};
