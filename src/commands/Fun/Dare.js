const Command = require("../../abstract/command");

module.exports = class Dare extends Command {
    constructor(...args) {
        super(...args, {
            name: "dare",
            aliases: ["dare"],
            description: "Get a random dare.",
            category: "Fun",
            usage: ["dare"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }
    async run({ message }) {
        const body = await this.client.util.requestget("https://api.truthordarebot.xyz/v1/dare");
        if (!body) return message.channel.send("An error occured, please try again.");
        const embed = this.client.util.embed()
            .setTitle("Dare")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);
        message.channel.send({ embeds: [embed] });
    }

    async exec ({ intraction }) {
        const body = await this.client.util.requestget("https://api.truthordarebot.xyz/v1/dare");
        if (!body) return intraction.reply("An error occured, please try again.");
        const embed = this.client.util.embed()
            .setTitle("Dare")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);
        intraction.reply({ embeds: [embed] });
    }
}