const Command = require("../../abstract/command");
module.exports = class Backupemojis extends Command {
    constructor(...args) {
        super(...args, {
            name: "backupemojis",
            description: "Backup all emojis in a server",
            category: "Utilities",
            aliases: ["backupemoji", "backupemotes", "backupemote"],
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
        const guild = message.guild;
        const emojis = await guild.emojis.fetch();
        const data = await this.client.database.emojiData.get(
            message.member.id
        );
        const emojiArray = [];
        emojis.forEach((emoji) => {
            emojiArray.push({
                name: emoji.name,
                id: emoji.id,
                ext: emoji.animated ? "gif" : "png",
            });
        });
        data.emojis = emojiArray;
        data.emojiLength = emojiArray.length;
        data.guildName = guild.name;
        await this.client.database.emojiData.putEmoji(message.member.id, data);
        message.channel.send(
            `Successfully backed up ${emojiArray.length} emojis from ${guild.name}`
        );
    }

    async exec({ interaction }) {
        const guild = interaction.guild;
        const emojis = await guild.emojis.fetch();
        const data = await this.client.database.emojiData.get(
            interaction.member.id
        );
        const emojiArray = [];
        emojis.forEach((emoji) => {
            emojiArray.push({
                name: emoji.name,
                id: emoji.id,
                ext: emoji.animated ? "gif" : "png",
            });
        });
        data.emojis = emojiArray;
        data.emojiLength = emojiArray.length;
        data.guildName = guild.name;
        await this.client.database.emojiData.putEmoji(
            interaction.member.id,
            data
        );
        interaction.reply(
            `Successfully backed up ${emojiArray.length} emojis from ${guild.name}`
        );
    }
};
