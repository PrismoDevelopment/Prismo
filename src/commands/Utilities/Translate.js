const Command = require("../../abstract/command");

module.exports = class Translate extends Command {
    constructor(...args) {
        super(...args, {
            name: "translate",
            aliases: ["ts", "tr"],
            description: "Translate text to another language.",
            usage: ["tr <text> <language>"],
            category: "Utilities",
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            options: [
                {
                    name: "text",
                    description: "The text you want to translate.",
                    type: 3,
                    required: true,
                },
                {
                    name: "language",
                    description: "The language you want to translate to.",
                    type: 3,
                    required: false,
                },
            ],
        });
    }

    async run({ message, args }) {
        try {
            if (message.reference === null) {
                const text = args.join(" ");
                if (!text) {
                    return message.channel.send({
                        content: "Please provide text to translate.",
                    });
                }
                const language = args[1] || "en";
                message.channel.sendTyping();
                const translate = require("@iamtraction/google-translate");
                const result = await translate(text, { to: language });
                const embed = this.client.util
                    .embed()
                    .setTitle("Translate")
                    .setColor(this.client.config.Client.PrimaryColor)
                    .setDescription(`**${result.text}**`);
                message.reply({ embeds: [embed] });
            } else if (message.reference !== null) {
                const text = await message.channel.messages
                    .fetch(message.reference?.messageId)
                    .then((msg) => msg.content);
                if (!text) {
                    return message.channel.send({
                        content: "Please provide text to translate.",
                    });
                }
                const language = args[0] || "en";
                message.channel.sendTyping();
                const translate = require("@iamtraction/google-translate");
                const result = await translate(text, { to: language });
                const embed = this.client.util
                    .embed()
                    .setTitle("Translate")
                    .setColor(this.client.config.Client.PrimaryColor)
                    .setDescription(`**${result.text}**`);
                message.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async exec({ interaction }) {
        try {
            const text = interaction.options.getString("text").toLowerCase();
            if (!text)
                return interaction.reply("Please provide text to translate.");
            interaction.channel.sendTyping();
            const language = interaction.options.getString("language") || "en";
            const translate = require("@iamtraction/google-translate");
            const result = await translate(text, { to: language });
            const embed = this.client.util
                .embed()
                .setTitle("Translate")
                .setColor(this.client.config.Client.PrimaryColor)
                .setDescription(`**${result.text}**`);
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
        }
    }
};
