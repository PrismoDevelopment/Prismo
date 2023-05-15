const Command = require("../../abstract/command");

module.exports = class Paranoia extends Command {
    constructor(...args) {
        super(...args, {
            name: "paranoia",
            aliases: ["paranoia"],
            description: "Get a random paranoia question.",
            category: "Fun",
            usage: ["paranoia"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }
    async run({ message }) {
        const body = await this.client.util.requestget("https://api.truthordarebot.xyz/v1/paranoia");
        if (!body) return message.channel.send("An error occured, please try again.");
        const embed = this.client.util.embed()
            .setTitle("Paranoia")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);
        message.channel.send({ embeds: [embed] });
    }

    async exec ({ intraction }) {
        const body = await this.client.util.requestget("https://api.truthordarebot.xyz/v1/paranoia");
        if (!body) return intraction.reply("An error occured, please try again.");
        const embed = this.client.util.embed()
            .setTitle("Paranoia")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);
        intraction.reply({ embeds: [embed] });
    }
}