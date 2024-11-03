const Command = require("../../abstract/command");
const { parseEmoji } = require("discord.js");
module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "roleicon",
            aliases: ["ri", "ricon"],
            description: "Sets role icon for you",
            category: "Utilities",
            userPerms: ["SendMessages", "ManageRoles"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://imgur.com/tv5R4JV",
            usage: "roleicon <role> <emoji>",
            options: [
                {
                    type: 8,
                    name: "role",
                    description: "Role To Set Icon",
                    required: true,
                },
                {
                    type: 3,
                    name: "emoji",
                    description: "Emoji To Set As Icon",
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        try {
            if (!args[0] || !args[1])
                return message?.reply({
                    content:
                        "Please Provide A Role And An Emoji To Set As Icon!",
                    ephemeral: true,
                });
            const role =
                message?.mentions.roles.first() ||
                message?.guild.roles.cache.get(args[0]);
            if (!role)
                return message?.reply({
                    content: "Please Provide A Valid Role!",
                    ephemeral: true,
                });
            let emoji = args[1]?.trim();
            let url = (id) =>
                `https://cdn.discordapp.com/emojis/${id}.png?quality=lossless`;
            const parsedEmoji = parseEmoji(emoji);
            if (!parsedEmoji.id || !parsedEmoji)
                return message?.reply({
                    content: "Please Provide A Valid Emoji!",
                    ephemeral: true,
                });
            if (parsedEmoji.id) {
                emoji = url(parsedEmoji.id);
            }
            role.setIcon(emoji)
                .then((c) => {
                    message?.reply({
                        content: `Successfully Updated **${role.name}** Role Icon!`,
                        ephemeral: true,
                    });
                })
                .catch((e) => {
                    if(e.message.includes("Missing Permissions")) return message?.reply({
                        content: `I Don't Have Permissions To Manage Roles!`,
                        ephemeral: true,
                    });
                    message?.reply({
                        content: `Guild Is Not In Level 2 Boosting Tier!`,
                        ephemeral: true,
                    });
                });
        } catch (e) {
            message?.reply({
                content: e.message,
                ephemeral: true,
            });
        }
    }
    async exec({ interaction }) {
        try {
            const roleData = interaction?.options.getRole("role");
            const emojiData = interaction?.options.getString("emoji");
            let emoji = emojiData.trim();
            let url = (id) =>
                `https://cdn.discordapp.com/emojis/${id}.png?quality=lossless`;
            const parsedEmoji = parseEmoji(emojiData);
            if (!parsedEmoji.id || !parsedEmoji)
                return interaction?.reply({
                    content: "Please Provide A Valid Emoji!",
                    ephemeral: true,
                });
            if (parsedEmoji.id) {
                emoji = url(parsedEmoji.id);
            }
            roleData
                .setIcon(emoji)
                .then((c) => {
                    interaction?.reply({
                        content: `Successfully Updated **${roleData.name}** Role Icon!`,
                        ephemeral: true,
                    });
                })
                .catch((e) => {
                    if(e.message.includes("Missing Permissions")) return interaction?.reply({
                        content: `I Don't Have Permissions To Manage Roles!`,
                        ephemeral: true,
                    });
                    interaction?.reply({
                        content: `Guild Is Not In Level 2 Boosting Tier!`,
                        ephemeral: true,
                    });
                });
        } catch (e) {
            interaction?.reply({
                content: e.message,
                ephemeral: true,
            });
        }
    }
};
