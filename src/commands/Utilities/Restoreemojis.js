const Command = require("../../abstract/command");
module.exports = class Restoreemojis extends Command {
    constructor(...args) {
        super(...args, {
            name: "restoreemojis",
            description: "Restore all emojis from a backup",
            category: "Utilities",
            aliases: ["restoreemoji", "restoreemotes", "restoreemote"],
            userPerms: ["ManageEmojisAndStickers"],
            botPerms: [
                "ManageEmojisAndStickers",
                "ViewChannel",
                "SendMessages",
            ],
            cooldown: 10,
        });
    }
    async run({ message }) {
        const data = await this.client.database.emojiData.get(
            message.member.id
        );
        const guild = message.guild;
        const emojis = await guild.emojis.fetch();
        if (data.emojiLength === 0)
            return message.channel.send("You have no emojis to restore!");
        if (emojis.size > 0)
            return message.channel.send(
                "You already have emojis in this server!"
            );
        let embed = this.client.util
            .embed()
            .setTitle("Restore Emojis")
            .setDescription(
                `Are you sure you want to restore ${data.emojiLength} emojis from ${data.guildName}?`
            )
            .setColor(this.client.config.Client.PrimaryColor);
        message
            .reply({
                embeds: [embed],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 3,
                                label: "Yes",
                                custom_id: "yes",
                            },
                            { type: 2, style: 4, label: "No", custom_id: "no" },
                        ],
                    },
                ],
            })
            .then(async (msg) => {
                // eslint-disable-line
                const filter = (i) => i.user.id === message.author.id;
                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 25000,
                });
                collector.once("collect", async (i) => {
                    if (i.customId === "yes") {
                        const emojiArray = data.emojis;
                        emojiArray.forEach(async (emoji) => {
                            await guild.emojis.create({
                                attachment: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.ext}`,
                                name: emoji.name,
                            });
                        });
                        await i.update({
                            content: "Successfully restored the emojis.",
                            components: [],
                        });
                    } else if (i.customId === "no") {
                        await i.update({
                            content: "Cancelled the command.",
                            components: [],
                        });
                    }
                });
                collector.once("end", async (collected) => {
                    if (collected.size === 0) {
                        await msg.edit({
                            content: "Timed out.",
                            components: [],
                        });
                    }
                });
            });
    }
    async exec({ interaction }) {}
};
