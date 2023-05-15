const Command = require("../../abstract/command");
const { Utils } = require("discord.js");
const { default: axios } = require("axios");

module.exports = class steal extends Command {
    constructor(...args) {
        super(...args, {
            name: "steal",
            aliases: ["stealemojis"],
            description: "Steal emojis and adds to the server.",
            usage: ["steal <emojis>"],
            category: "Utilities",
            userPerms: ["ManageEmojisAndStickers"],
            botPerms: [
                "ManageEmojisAndStickers",
                "ViewChannel",
                "SendMessages",
            ],
            cooldown: 5,
        });
    }
    async run({ message, args }) {
        if (!args) return message.reply({ content: `No emojis provided!` });
        const emojiargs = args.join("");
        let animemojis = emojiargs.match(/[a][:]([A-Za-z0-9_~])+[:]\d{15,}/g);
        let normemojis = emojiargs.match(/[^a][:]([A-Za-z0-9_~])+[:]\d{15,}/g);
        let desc = "Emoji(s) : ";
        if (animemojis && normemojis) {
            if (animemojis.length + normemojis.length > 15) {
                return message.reply({
                    content: `You can only add 15 emojis at a time!`,
                });
            }
        }

        if (animemojis) {
            if (animemojis.length > 15) {
                return message.reply({
                    content: `You can only add 15 emojis at a time!`,
                });
            }
            for (let aemoji in animemojis) {
                const list = animemojis[aemoji].split(":");
                const Url = `https://cdn.discordapp.com/emojis/${list[2]}.gif`;
                await message.guild.emojis
                    .create({ attachment: Url, name: list[1] })
                    .then(
                        (emoji) => (desc += `<a:${emoji.name}:${emoji.id}> `)
                    );
            }
        }

        if (normemojis) {
            if (normemojis.length > 15) {
                return message.reply({
                    content: `You can only add 15 emojis at a time!`,
                });
            }
            for (let emojis in normemojis) {
                const list = normemojis[emojis].split(":");
                const Url = `https://cdn.discordapp.com/emojis/${list[2]}.png`;
                await message.guild.emojis
                    .create({ attachment: Url, name: list[1] })
                    .then((emoji) => (desc += `<:${emoji.name}:${emoji.id}> `));
            }
        }

        const embed = this.client.util
            .embed()
            .setTitle("Successfully added emojis to server.")
            .setColor(this.client.util.color(message))
            .setDescription(desc);

        message.reply({ embeds: [embed] });
    }
};
