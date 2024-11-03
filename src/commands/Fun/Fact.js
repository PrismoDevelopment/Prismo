const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Fact extends Command {
    constructor(...args) {
        super(...args, {
            name: "fact",
            aliases: ["fact"],
            description: "Provides a random fact.",
            usage: ["fact"],
            category: "Fun",
            cooldown: 2,
            image: "https://i.imgur.com/uiEO0pM.png",
        });
    }

    async run({ message, args }) {
        const fact = await nekoClient.sfw.fact();
        const embed = this.client.util.embed()
            .setTitle(`Fact`)
            .setDescription(fact.fact)
            .setColor(this.client.config.Client.PrimaryColor);
        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const fact = await nekoClient.sfw.fact();
        const embed = this.client.util.embed()
            .setTitle(`Fact`)
            .setDescription(fact.fact)
            .setColor(this.client.config.Client.PrimaryColor);
        interaction?.reply({ embeds: [embed] });
    }
};
