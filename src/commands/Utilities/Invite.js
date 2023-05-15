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
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }

    async run({ message, args }) {
        message.channel.send({
            content: `Here You Go!`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Invite",
                            style: 5,
                            url: `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.gg%2FauvcWgmXxA&response_type=code&scope=bot%20applications.commands%20identify`,
                        },
                    ],
                },
            ],
        });
    }

    async exec({ intraction }) {
        const embed = this.client.util
            .embed()
            .setTitle("Invite Link")
            .setDescription(
                `[Click Here](https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands) To Invite Me To Your Server`
            )
            .setFooter({
                text: `Requested By ${intraction.user.username}`,
                iconURL: intraction.user.avatarURL,
            });
        intraction.send({
            embed: embed,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Invite",
                            style: 5,
                            url: `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands`,
                        },
                    ],
                },
            ],
        });
    }
};
