const Event = require("../abstract/event");
const { Collection } = require("@discordjs/collection");
const { MessageReaction, GuildMember } = require("discord.js");
module.exports = class messageReactionAdd extends Event {
    constructor(...args) {
        super(...args);
        this.ratelimits = new Collection();
    }

    get name() {
        return "messageReactionAdd";
    }

    get once() {
        return false;
    }

    /**
     * @param {MessageReaction} messageReaction
     * @param {GuildMember} user
     */
    async run(messageReaction, user) {
        let data = await this.client.database.starboardData.get(messageReaction.message.guild.id);
        if (!data) return;
        if (data.starboard === false) return;
        if (data.starboardChannel === null) return;
        if (messageReaction.emoji.name !== data.starboardEmoji) return;
        if (messageReaction.count < data.starboardCount) return;
        if (user.bot) return;
        // if (messageReaction.message.channel.id === data.starboardChannel) return;

        let starboardChannel = messageReaction.message.guild.channels.cache.get(data.starboardChannel);
        if (!starboardChannel) return;

        let starboardMessage = await messageReaction.message.channel.messages.fetch(`${messageReaction.message.id}`);
        if (!starboardMessage) return;
        let starboardEmbed = this.client.util.embed()
            .setAuthor({ name: starboardMessage.author.username, iconURL: starboardMessage.author.displayAvatarURL({ dynamic: true }) })
            .setFooter({ text: `ID: ${starboardMessage.id}` })
            .setDescription(starboardMessage.content || "Attachment")
            .setColor(this.client.PrimaryColor)
            .setTimestamp();

        let compos = [
            { type: 1, components: [{ type: 2, style: 5, label: "Jump to Message", url: starboardMessage.url }] }
        ];

        if (starboardMessage.attachments.size > 0) {
            starboardEmbed.setImage(starboardMessage.attachments.first().url);
        }

        if (starboardMessage.embeds.length > 0) {
            starboardEmbed.setImage(starboardMessage.embeds[0].image.url);
        }

        let starboardmessages = await starboardChannel.messages.fetch({ limit: 100 });
        let starboardmsg = starboardmessages.find(m => m?.embeds[0]?.footer?.text === "ID: " + starboardMessage.id);
        if (starboardmsg) {
            starboardmsg.edit({ content: `⭐ **${messageReaction.count}** | ${starboardMessage.url}` }).catch(() => { });
        } else {
            starboardChannel.send({ content: `⭐ **${messageReaction.count}** | ${starboardMessage.url}`, embeds: [starboardEmbed], components: compos }).catch(() => { });
        }
    }
}