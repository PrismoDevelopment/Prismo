const Command = require("../../abstract/command");

module.exports = class Banner extends Command {
    constructor(...args) {
        super(...args, {
            name: "banner",
            aliases: ["banner"],
            description: "gives a banner of user you mentioned",
            usage: ["banner"],
            category: "Utilities",
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            guildOnly: true,
            cooldown: 3,
            image:"https://i.imgur.com/YBOEHFN.png",
            options: [
                {
                    name: "user",
                    description: "The user to get the banner of",
                    type: 6,
                    required: false
                }
            ]
        });
    }
    async run({ message, args }) {
        const user = args[0] ? await this.client.util.userQuery(args[0]) : message?.author.id;
        let realUser = await this.client.users.fetch(user, { cache: false, force: true });
        const banner = realUser.bannerURL({ dynamic: true, size: 2048 })
        if (!banner) return message?.channel.send({ embeds: [this.client.util.errorDelete(message, "User does not have a banner.")] });
        const embed = this.client.util.embed()
            .setAuthor({ name: realUser.username + "'s Banner", iconURL: realUser.displayAvatarURL({ dynamic: true }) })
            .setImage(banner)
            .setColor(this.client.config.Client.PrimaryColor)
            .setFooter({ text: `Requested by ${message?.author.username}`, iconURL: message?.author.displayAvatarURL({ dynamic: true }) })
        let components = []
        if (banner.includes(".gif")) {
            components = [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "PNG",
                            style: 5,
                            url: banner.replace(".gif", ".png")
                        },
                        {
                            type: 2,
                            label: "JPG",
                            style: 5,
                            url: banner.replace(".gif", ".jpg")
                        },
                        {
                            type: 2,
                            label: "WEBP",
                            style: 5,
                            url: banner.replace(".gif", ".webp")
                        },
                        {
                            type: 2,
                            label: "GIF",
                            style: 5,
                            url: banner
                        }
                    ]
                }
            ]
        } else {
            components = [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "PNG",
                            style: 5,
                            url: banner.replace(".webp", ".png")
                        },
                        {
                            type: 2,
                            label: "JPG",
                            style: 5,
                            url: banner.replace(".webp", ".jpg")
                        },
                        {
                            type: 2,
                            label: "WEBP",
                            style: 5,
                            url: banner
                        }
                    ]
                }
            ]
        }
        message?.channel.send({ embeds: [embed], components: components });
    }

    async exec({ interaction }) {
        const user = interaction?.options.getUser("user") ? interaction?.options.getUser("user").id : interaction?.user.id;
        let realUser = await this.client.users.fetch(user, { cache: false, force: true });
        const banner = realUser.bannerURL({ dynamic: true, size: 2048 })
        if (!banner) return interaction?.reply({ embeds: [this.client.util.errorDelete(interaction, "User does not have a banner.")], ephemeral: true });
        const embed = this.client.util.embed()
            .setAuthor({ name: realUser.username + "'s Banner", iconURL: realUser.displayAvatarURL({ dynamic: true }) })
            .setImage(banner)
            .setColor(this.client.config.Client.PrimaryColor)
            .setFooter({ text: `Requested by ${interaction?.user.username}`, iconURL: interaction?.user.displayAvatarURL({ dynamic: true }) })
        let components = []
        if (banner.includes(".gif")) {
            components = [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "PNG",
                            style: 5,
                            url: banner.replace(".gif", ".png")
                        },
                        {
                            type: 2,
                            label: "JPG",
                            style: 5,
                            url: banner.replace(".gif", ".jpg")
                        },
                        {
                            type: 2,
                            label: "WEBP",
                            style: 5,
                            url: banner.replace(".gif", ".webp")
                        },
                        {
                            type: 2,
                            label: "GIF",
                            style: 5,
                            url: banner
                        }
                    ]
                }
            ]
        } else {
            components = [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "PNG",
                            style: 5,
                            url: banner.replace(".webp", ".png")
                        },
                        {
                            type: 2,
                            label: "JPG",
                            style: 5,
                            url: banner.replace(".webp", ".jpg")
                        },
                        {
                            type: 2,
                            label: "WEBP",
                            style: 5,
                            url: banner
                        }
                    ]
                }
            ]
        }
        interaction?.reply({ embeds: [embed], components: components });
    }
}
