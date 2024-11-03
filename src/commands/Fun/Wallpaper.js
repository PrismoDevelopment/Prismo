const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class WallpaperCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "wallpaper",
            aliases: ["wallpaper"],
            description: "Get a wallpaper image.",
            usage: ["wallpaper"],
            category: "Fun",
            cooldown: 5,
            image: "https://i.imgur.com/qmMzgxY.png",
        });
    }

    async run({ message, args }) {
        const wallpaper = await nekoClient.sfw.wallpaper();
        const embed = this.client.util.embed()
            .setTitle("Wallpaper")
            .setImage(wallpaper.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const wallpaper = await nekoClient.sfw.wallpaper();
        const embed = this.client.util.embed()
            .setTitle("Wallpaper")
            .setImage(wallpaper.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
