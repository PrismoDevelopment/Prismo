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
            image: "https://i.imgur.com/VkuNgBm.png",
        });
    }

    async run({ message }) {
        const body = await this.client.fetch("https://badge.prismobot.xyz/dare", { method: "GET" }).then(res => res.json());
        if (!body) return message?.channel.send("An error occurred, please try again.");

        const embed = this.client.util.embed()
            .setTitle("Dare")
            .setDescription(body.dare)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const body = await this.client.fetch("https://badge.prismobot.xyz/dare", { method: "GET" }).then(res => res.json());
        if (!body) return interaction?.reply("An error occurred, please try again.");

        const embed = this.client.util.embed()
            .setTitle("Dare")
            .setDescription(body.dare)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
