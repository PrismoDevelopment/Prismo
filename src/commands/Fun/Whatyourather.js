const Command = require("../../abstract/command");

module.exports = class Whatyourather extends Command {
    constructor(...args) {
        super(...args, {
            name: "whatyourather",
            aliases: ["whatyourather", "wyr"],
            description: "Get a random whatyourather question.",
            category: "Fun",
            usage: ["whatyourather"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }
    async run({ message }) {
        const body = await this.client.util.requestget("https://api.truthordarebot.xyz/v1/wyr");
        if (!body) return message.channel.send("An error occured, please try again.");
        const embed = this.client.util.embed()
            .setTitle("WhatYourather")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);
        message.channel.send({ embeds: [embed] });
    }

    async exec ({ intraction }) {
        const body = await this.client.util.requestget("https://api.truthordarebot.xyz/v1/wyr");
        if (!body) return intraction.reply("An error occured, please try again.");
        const embed = this.client.util.embed()
            .setTitle("WhatYourather")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);
        intraction.reply({ embeds: [embed] });
    }
}
