const Command = require("../../abstract/command");

module.exports = class Truth extends Command {
    constructor(...args) {
        super(...args, {
            name: "truth",
            aliases: ["truth"],
            description: "Get a random truth question.",
            category: "Fun",
            usage: ["truth"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }
    async run({ message }) {
        const body = await this.client.util.requestget("https://api.truthordarebot.xyz/v1/truth");
        if (!body) return message.channel.send("An error occured, please try again.");
        const embed = this.client.util.embed()
            .setTitle("Truth")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);
        message.channel.send({ embeds: [embed] });
    }

    async exec ({ intraction }) {
        const body = await this.client.util.requestget("https://api.truthordarebot.xyz/v1/truth");
        if (!body) return intraction.reply("An error occured, please try again.");
        const embed = this.client.util.embed()
            .setTitle("Truth")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);
        intraction.reply({ embeds: [embed] });
    }
}