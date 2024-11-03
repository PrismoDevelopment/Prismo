const { ButtonStyle } = require('discord.js');
const GiveawayData = require('../../../models/giveawayData');
const Giveaway = require('./giveaway');
const e = require('express');

module.exports = class GiveawayManager {
    /**
     * 
     * @param {import('../../PrismoClient')} client 
     */
    constructor(client) {
        this.client = client;
        /**
         * The giveaways managed by this manager
         * @type {Giveaway[]}
         */
        this.giveaways = [];
    }

    /**
     * 
     * @param {Giveaway} giveaway
     */
    async mainEmbed(giveaway) {
        if (giveaway.messages.title) giveaway.messages.title = giveaway.messages.title.replace('{prize}', giveaway.prize);
        if (giveaway.messages.description) {
            giveaway.messages.description = giveaway.messages.description.replace('{prize}', giveaway.prize);
            giveaway.messages.description = giveaway.messages.description.replace('{winnerCount}', giveaway.winnerCount);
            giveaway.messages.description = giveaway.messages.description.replace('{timestamp}', `${this.client.util.discordFormatTime(giveaway.endsAt, 'R')} ${this.client.util.discordFormatTime(giveaway.endsAt, 'T')}`);
            giveaway.messages.description = giveaway.messages.description.replace('{entries}', giveaway.entered.length);
            giveaway.messages.description = giveaway.messages.description.replace('{hoster}', giveaway.hoster);
            giveaway.messages.description = giveaway.messages.description.replace('{winners}', giveaway.winners.join(', ').length == 0 ? 'None' : giveaway.winners.join(', '));
        }
        const embed = this.client.util.embed()
            .setAuthor({ name: typeof giveaway.messages.title == 'string' ? giveaway.messages.title : giveaway.prize, iconURL: this.client.user.displayAvatarURL() })
            .setDescription(giveaway.messages.description || `Ends at ${this.client.util.discordFormatTime(giveaway.endsAt, 'R')} ${this.client.util.discordFormatTime(giveaway.endsAt, 'T')}\nHosted by <@${giveaway.hoster}>`)
            .setColor(Number.isInteger(giveaway?.messages?.embedColor) ? giveaway.messages.embedColor : 0x2b2d31)
            .setURL(giveaway?.messages?.url || null)
            .setImage(giveaway?.messages?.image || null)
        if (giveaway.endsAt !== Infinity) {
            embed.setTimestamp(giveaway.endsAt);
            embed.setFooter({
                text: `${giveaway.winnerCount} winner${giveaway.winnerCount > 1 ? 's' : ''} | Ends at`,
            });
        }
        return embed;
    }

    /**
     * 
     * @param {Giveaway} giveaway
     */
    async endEmbed(giveaway) {
        if (giveaway.messages.title) giveaway.messages.title = giveaway.messages.title.replace('{prize}', giveaway.prize);
        if (giveaway.messages.description) {
            giveaway.messages.description = giveaway.messages.description.replace('{prize}', giveaway.prize);
            giveaway.messages.description = giveaway.messages.description.replace('{winnerCount}', giveaway.winnerCount);
            giveaway.messages.description = giveaway.messages.description.replace('{timestamp}', `${this.client.util.discordFormatTime(giveaway.endsAt, 'R')} ${this.client.util.discordFormatTime(giveaway.endsAt, 'T')}`);
            giveaway.messages.description = giveaway.messages.description.replace('{entries}', giveaway.entered.length);
            giveaway.messages.description = giveaway.messages.description.replace('{hoster}', giveaway.hoster);
            giveaway.messages.description = giveaway.messages.description.replace('{winners}', giveaway.winners.join(', ').length == 0 ? 'None' : giveaway.winners.join(', '));
        }
        const embed = this.client.util.embed()
            .setAuthor({ name: typeof giveaway.messages.title == 'string' ? giveaway.messages.title : giveaway.prize, iconURL: this.client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(giveaway.messages.description || `Ended ${this.client.util.discordFormatTime(giveaway.endsAt, 'R')} ${this.client.util.discordFormatTime(giveaway.endsAt, 'T')}\n${giveaway.winners.length == 0 ? '' : `Winners: ${giveaway.winners.map((x) => `<@${x}>`).join(', ')}\n`}Hosted by <@${giveaway.hoster}>`)
            .setColor(0x2b2d31)
            .setURL(giveaway?.messages?.url || null)
            .setImage(giveaway?.messages?.image || null)
            .setFooter({
                text: 'Ended at'
            })
        if (giveaway.endsAt !== Infinity) embed.setTimestamp(giveaway.endsAt);
        return embed;
    }

    /**
     * 
     * @param {Giveaway} giveaway
     */
    async embedButton(giveaway) {
        const button = this.client.util.button()
            .setCustomId(`giveaway-${giveaway.messageId}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel(giveaway.entered.length.toString() || 0)
            .setEmoji('<:imp_Giveawaygift_icon:1066645804502220840>')
            .setDisabled(giveaway.ended)
        return button;
    }

    async start(channel, options) {
        return new Promise(async (resolve, reject) => {
            if (!channel?.id || !channel.isTextBased()) {
                return reject(`channel is not a valid text based channel. (val=${channel})`);
            }
            if (channel.isThread() && !channel.sendable) {
                return reject(
                    `The manager is unable to send messages in the provided ThreadChannel. (id=${channel.id})`
                );
            }
            let giveaway = new Giveaway(this, {
                id: (await this.client.util.makeCode(8)),
                hoster: options.hoster.id,
                prize: options.prize,
                startAt: Date.now(),
                endsAt: options.duration + Date.now(),
                winnerCount: options.winnerCount,
                channelId: channel.id,
                guildId: channel.guild.id,
                messages: options.messages,
                extraData: options.extraData,
                reaction: options.reaction
            })
            await this.saveData(giveaway);
            const embed = await this.mainEmbed(giveaway);
            const message = await channel.send({
                content: `${this.client.config.Client.emoji.gift} **GIVEAWAY STARTED** ${this.client.config.Client.emoji.gift}`,
                embeds: [embed]
            })
            giveaway.setMessageId(message.id);
            this.giveaways.push(giveaway);
            await message.react(giveaway.reaction).catch(async (err) => {
                await message.react(this.client.config.Client.emoji.giveaway2)
                giveaway.reaction = "1121823929204482148"
            });
            await this.saveData(giveaway);
            resolve(giveaway);
        })
    }

    async delete(messageId) {
        return new Promise(async (resolve, reject) => {
            const giveaway = this.giveaways.find((g) => g.messageId === messageId);
            if (!giveaway) {
                return reject(`No giveaway found with message id ${messageId}`);
            }
            giveaway.message ??= await giveaway.fetchMessage().catch(() => { });
            giveaway.message?.delete().catch(() => { });
            this.giveaways = this.giveaways.filter((g) => g.messageId !== messageId);
            await this.deleteData(giveaway);
        })
    }

    async deleteData(giveaway) {
        await GiveawayData.deleteOne({ _id: giveaway.id });
    }

    async saveData(giveaway) {
        let data = await GiveawayData.findOne({ _id: giveaway.id });
        if (!data) {
            data = new GiveawayData({
                _id: giveaway.id,
                hoster: giveaway.hoster,
                prize: giveaway.prize,
                startsAt: giveaway.startAt,
                endsAt: giveaway.endsAt,
                ended: giveaway.ended,
                channelId: giveaway.channelId,
                guildId: giveaway.guildId,
                messageId: giveaway.messageId,
                winnerCount: giveaway.winnerCount,
                winners: giveaway.winners,
                entered: giveaway.entered,
                extraData: giveaway.extraData,
                messages: giveaway.messages,
                reaction: giveaway.reaction
            });
        } else {
            data.hoster = giveaway.hoster;
            data.prize = giveaway.prize;
            data.startsAt = giveaway.startAt;
            data.endsAt = giveaway.endsAt;
            data.ended = giveaway.ended;
            data.channelId = giveaway.channelId;
            data.guildId = giveaway.guildId;
            data.messageId = giveaway.messageId;
            data.winnerCount = giveaway.winnerCount;
            data.winners = giveaway.winners;
            data.entered = giveaway.entered;
            data.extraData = giveaway.extraData;
            data.messages = giveaway.messages;
            data.reaction = giveaway.reaction;
        }
        await data.save();
    }

    async editData(giveaway) {
        let data = await GiveawayData.findOne({ _id: giveaway.id });
        if (!data) {
            data = new GiveawayData({
                _id: giveaway.id,
                hoster: giveaway.hoster,
                prize: giveaway.prize,
                startsAt: giveaway.startAt,
                endsAt: giveaway.endsAt,
                ended: giveaway.ended,
                channelId: giveaway.channelId,
                guildId: giveaway.guildId,
                messageId: giveaway.messageId,
                winnerCount: giveaway.winnerCount,
                winners: giveaway.winners,
                entered: giveaway.entered,
                extraData: giveaway.extraData,
                messages: giveaway.messages,
                reaction: giveaway.reaction
            });
        } else {
            data.hoster = giveaway.hoster;
            data.prize = giveaway.prize;
            data.startsAt = giveaway.startAt;
            data.endsAt = giveaway.endsAt;
            data.ended = giveaway.ended;
            data.channelId = giveaway.channelId;
            data.guildId = giveaway.guildId;
            data.messageId = giveaway.messageId;
            data.winnerCount = giveaway.winnerCount;
            data.winners = giveaway.winners;
            data.entered = giveaway.entered;
            data.extraData = giveaway.extraData;
            data.messages = giveaway.messages;
            data.reaction = giveaway.reaction;
        }
        await data.save();
        let index = this.giveaways.findIndex(g => g.id == giveaway.id);
        if (index > -1) {
            const newGiveaway = new Giveaway(this, giveaway)
            this.giveaways.splice(index, 1, newGiveaway);
        }
    }

    async updateStaticGiveaways() {
        let giveaways = await GiveawayData.find();
        giveaways.forEach(async giveaway => {
            let channel = await this.client.channels.fetch(giveaway.channelId);
            if (!channel) return;
            const giveawayData = new Giveaway(this, {
                id: giveaway._id,
                hoster: giveaway.hoster,
                prize: giveaway.prize,
                startAt: giveaway.startsAt,
                endsAt: giveaway.endsAt,
                ended: giveaway.ended,
                channelId: giveaway.channelId,
                guildId: giveaway.guildId,
                messageId: giveaway.messageId,
                winnerCount: giveaway.winnerCount,
                winners: giveaway.winners,
                entered: giveaway.entered,
                extraData: giveaway.extraData,
                messages: giveaway.messages,
                reaction: giveaway.reaction
            });
            this.giveaways.push(giveawayData);
        })
    }

    async checkRaffel() {
        this.giveaways.forEach(async giveaway => {
            if (giveaway.ended) return;
            if (giveaway.endsAt < Date.now()) {
                giveaway.end();
            }
        })
    }

    async init() {
        await this.updateStaticGiveaways();
        setInterval(() => {
            this.checkRaffel();
        }, 5000);
    }
}