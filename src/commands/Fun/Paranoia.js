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
            image: "https://i.imgur.com/3w4825E.png",
        });
    }

    async run({ message }) {
        let guilddata = await this.client.database.guildData.get(message?.guild.id);
        if (!guilddata) return message?.channel.send("Guild data not found!");

        const rating = guilddata.rratings ? "?rating=r" : "";
        const url = `https://api.truthordarebot.xyz/v1/paranoia${rating}`;
        const body = await this.client.util.requestget(url);
        if (!body) return message?.channel.send("An error occurred, please try again.");

        const embed = this.client.util.embed()
            .setTitle("Paranoia")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let guilddata = await this.client.database.guildData.get(interaction?.guild.id);
        if (!guilddata) return interaction?.reply("Guild data not found!");

        const rating = guilddata.rratings ? "?rating=r" : "";
        const url = `https://api.truthordarebot.xyz/v1/paranoia${rating}`;
        const body = await this.client.util.requestget(url);
        if (!body) return interaction?.reply("An error occurred, please try again.");

        const embed = this.client.util.embed()
            .setTitle("Paranoia")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
