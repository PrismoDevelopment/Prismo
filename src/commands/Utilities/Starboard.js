const Command = require("../../abstract/command");

module.exports = class starboard extends Command {
    constructor(...args) {
        super(...args, {
            name: "starboard",
            description: "enabling you to highlight and amplify a specific sentence within a designated channel.",
            category: "Utilities",
            aliases: ["starboard"],
            usage: "starboard <enable/disable> <channel> <emoji> <count>",
            cooldown: 5,
            image: "https://imgur.com/vy4InwJ",
            userPerms: ['ManageGuild'],
            botPerms: ['EmbedLinks', 'ViewChannel', 'SendMessages'],
            options: [
                {
                    type: 1,
                    name: "enable",
                    description: "Enable the starboard",
                    options: [
                        {
                            type: 7,
                            name: "channel",
                            description: "The channel to send the starboard messages",
                            required: true
                        },
                        {
                            type: 3,
                            name: "emoji",
                            description: "The emoji to use as the star",
                            required: false
                        },
                        {
                            type: 4,
                            name: "count",
                            description: "The amount of stars needed to post the message",
                            required: false
                        }
                    ]
                },
                {
                    type: 1,
                    name: "disable",
                    description: "Disable the starboard"
                }
            ]
        });
    }

    async run({ message, args }) {
        if (!args[0]) return message.reply({ content: "Please specify a subcommand (enable/disable)." });
        if (args[0] == "enable") {
            if (!args[1]) return message.reply({ content: "Please specify a channel." });
            let channel = message.guild.channels.cache.get(args[1].replace(/[\\<>#&!]/g, ""));
            if (!channel) return message.reply({ content: "Please specify a valid channel." });
            let emoji = args[2] || "⭐";
            let count = args[3] || 5;
            let data = await this.client.database.starboardData.get(message.guild.id);
            data.starboard = true;
            data.starboardChannel = channel.id;
            const emojiId = args[2];
            const emojiName = emojiId.startsWith(':') && emojiId.endsWith(':')
                ? /:(.*):/.exec(emojiId)[1]
                : emojiId;
            data.starboardEmoji = emojiName;
            data.starboardCount = count;
            await data.save();
            message.reply({ content: "Starboard enabled." });
        } else if (args[0] == "disable") {
            let data = await this.client.database.starboardData.get(message.guild.id);
            data.starboard = false;
            data.starboardChannel = null;
            data.starboardEmoji = "⭐";
            data.starboardCount = 5;
            await data.save();
            message.reply({ content: "Starboard disabled." });
        }
    }

    async exec({ interaction }) {
        let subcommand = interaction.options.getSubcommand();
        if (subcommand == "enable") {
            let channel = interaction.options.getChannel("channel");
            let emoji = interaction.options.getString("emoji") || "⭐";
            let count = interaction.options.getInteger("count") || 5;
            let data = await this.client.database.starboardData.get(interaction.guild.id);
            data.starboard = true;
            data.starboardChannel = channel.id;
            // we need the name of the emoji, not the id of the emoji and not <> around it just the name like <a:emoji:123456789> -> emoji
            const emojiId = emoji;
            const emojiName = emojiId.startsWith(':') && emojiId.endsWith(':')
                ? /:(.*):/.exec(emojiId)[1]
                : emojiId;
            data.starboardEmoji = emojiName;
            data.starboardCount = count;
            await data.save();
            interaction.reply({ content: "Starboard enabled.", ephemeral: true });
        }
        if (subcommand == "disable") {
            let data = await this.client.database.starboardData.get(interaction.guild.id);
            data.starboard = false;
            data.starboardChannel = null;
            data.starboardEmoji = "⭐";
            data.starboardCount = 5;
            await data.save();
            interaction.reply({ content: "Starboard disabled.", ephemeral: true });
        }
    }
}
