const Command = require("../../abstract/command");

module.exports = class Emojify extends Command {
    constructor(...args) {
        super(...args, {
            name: "emojify",
            aliases: ["emojify"],
            description: "Emojify your text.",
            category: "Fun",
            usage: ["emojify <text>"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            options: [
                {
                    name: "text",
                    description: "The text to emojify.",
                    type: 3,
                    required: true,
                },
            ],
        });
    }
    async run({ message, args }) {
        const text = args.join(" ");
        if (!text) return message.channel.send("Please provide text to emojify.");
        const emojified = this.client.util.emojify(text);
        message.channel.send(emojified);
    }

    async exec({ interaction }) {
        const text = interaction.options.getString("text");
        if (!text) return interaction.reply("Please provide text to emojify.");
        const emojified = this.client.util.emojify(text);
        interaction.reply(emojified);
    }
}
