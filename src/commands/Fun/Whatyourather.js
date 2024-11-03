const Command = require("../../abstract/command");

module.exports = class WouldYouRather extends Command {
    constructor(...args) {
        super(...args, {
            name: "whatyourather",
            aliases: ["whatyourather", "wyr"],
            description: "Get a random Would You Rather question.",
            category: "Fun",
            usage: ["whatyourather"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/Y0HBflH.png",
        });
    }

    async run({ message }) {
        let guildData = await this.client.database.guildData.get(message?.guild.id);
        if (!guildData) return message?.channel.send("Guild data not found!");

        const ratingQuery = guildData.rratings ? "?rating=r" : "";
        const body = await this.client.util.requestget(`https://api.truthordarebot.xyz/v1/wyr${ratingQuery}`);
        if (!body) return message?.channel.send("An error occurred, please try again.");

        const embed = this.client.util.embed()
            .setTitle("Would You Rather")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let guildData = await this.client.database.guildData.get(interaction?.guild.id);
        if (!guildData) return interaction?.reply("Guild data not found!");

        const ratingQuery = guildData.rratings ? "?rating=r" : "";
        const body = await this.client.util.requestget(`https://api.truthordarebot.xyz/v1/wyr${ratingQuery}`);
        if (!body) return interaction?.reply("An error occurred, please try again.");

        const embed = this.client.util.embed()
            .setTitle("Would You Rather")
            .setDescription(body.question)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
