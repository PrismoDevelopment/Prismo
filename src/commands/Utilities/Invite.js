const Command = require("../../abstract/command");

module.exports = class Invite extends Command {
    constructor(...args) {
        super(...args, {
            name: "invite",
            aliases: ["botinvite", "inv"],
            description: "Get the invite link for the bot",
            usage: ["invite"],
            category: "Utilities",
            examples: ["invite"],
            userPerms: ["SendMessages"],
            guildOnly: true,
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image:"https://i.imgur.com/F2gWafN.png",
        });
    }

    async run({ message, args }) {
        message?.channel.send({
            content: `Here You Go!`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Invite",
                            emoji: this.client.config.Client.emoji.invite,
                            style: 5,
                            url: `https://discord.com/api/oauth2/authorize?client_id=1024365860246278244&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.gg%2F5GWnQGbgZH&response_type=code&scope=bot%20applications.commands%20identify`,
                        },
                        {
                            type: 2,
                            label: "Support",
                            emoji: this.client.config.Client.emoji.support,
                            style: 5,
                            url: `https://discord.gg/k2HNyjg5eb`,
                        }
                    ],
                },
            ],
        });
    }

    async exec({ interaction }) {
        const embed = this.client.util
            .embed()
            .setTitle("Invite Link")
            .setDescription(
                `[Click Here](https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands) To Invite Me To Your Server`
            )
            .setFooter({
                text: `Requested By ${interaction?.user.username}`,
                iconURL: interaction?.user.displayAvatarURL(),
            });
        interaction?.reply({
            embed: embed,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Invite",
                            emoji: this.client.config.Client.emoji.invite,
                            style: 5,
                            url: `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands`,
                        },
                        {
                            type: 2,
                            label: "Support",
                            emoji: this.client.config.Client.emoji.support,
                            style: 5,
                            url: `https://discord.gg/k2HNyjg5eb`,
                        }
                    ],
                },
            ],
        });
    }
};
