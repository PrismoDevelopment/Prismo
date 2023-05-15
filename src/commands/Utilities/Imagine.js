const Command = require("../../abstract/command");
const { Configuration, OpenAIApi } = require("openai");
const { AttachmentBuilder } = require("discord.js");
module.exports = class Imagine extends Command {
    constructor(...args) {
        super(...args, {
            name: "imagine",
            aliases: ["imagine"],
            description: "imagine",
            usage: ["imagine <text>"],
            userPrems: ["SendMessages"],
            botPrems: ["SendMessages", "EmbedLinks"],
            category: "Utilities",
            guildOnly: true,
            vote: true,
            cooldown: 60,
            options: [
                {
                    name: "text",
                    description: "The text to imagine",
                    type: 3,
                    required: true
                }
            ]
        });
    }
    async run({ message, args }) {
        let imagine = await this.client.util.imagine(args.join(" "));
        let embed = this.client.util.embed()
            .setTitle(`Imagine`)
            .setDescription(imagine)
            .setColor(this.client.config.Client.PrimaryColor)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
        message.channel.send({ embeds: [embed] });
    }
    async exec({ interaction }) {
        let imagine = await this.client.util.imagine(interaction.options.getString("text"));
        let embed = this.client.util.embed()
            .setTitle(`Imagine`)
            .setDescription(imagine)
            .setColor(this.client.config.Client.PrimaryColor)
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        interaction.reply({ embeds: [embed] });
    }
};