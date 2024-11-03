module.exports = class Giveaway {
    /**
     * 
     * @param {import('./manager')} manager 
     */
    constructor(manager, options) {
        this.manager = manager;
        this.client = manager.client;
        /**
         * The id of the giveaway
         * @type {String}
         */
        this.id = options.id;
        /**
         * The hoster of the giveaway
         * @type {String}
         * @example '123456789012345678'
         */
        this.hoster = options.hoster;
        /**
         * The prize of the giveaway
         * @type {String}
         */
        this.prize = options.prize;
        /**
         * The start time of the giveaway
         * @type {Number}
         */
        this.startAt = options.startAt;
        /**
         * The end time of the giveaway
         * @type {Number}
         */
        this.endsAt = options.endsAt;
        /**
         * Whether the giveaway has ended or not
         * @type {Boolean}
         */
        this.ended = options.ended || false;
        /**
         * The channel id of the giveaway
         * @type {String}
         */
        this.channelId = options.channelId;
        /**
         * The guild id of the giveaway
         * @type {String}
         */
        this.guildId = options.guildId;
        /**
         * The message id of the giveaway
         * @type {String}
         */
        this.messageId = options.messageId;
        /**
         * The amount of winners of the giveaway
         * @type {Number}
         */
        this.winnerCount = options.winnerCount;
        /**
         * The winners of the giveaway
         * @type {String[]}
         */
        this.winners = options.winners || [];
        /**
         * The people who entered the giveaway
         * @type {String[]}
         */
        this.reaction = options.reaction;
        /**
         * The people who entered the giveaway
         * @type {String[]}
        */
        this.entered = options.entered || [];
        /**
         * Extra data of the giveaway
         * @type {Object}
         */
        this.extraData = options.extraData || {};
        /**
         * The messages of the giveaway
         * @type {Object}
         * @property {String} embedColor The giveaway embed color
         * @property {String} description The giveaway embed description
         * @property {String} title The giveaway embed title
         * @property {String} url The giveaway embed url
         * @property {String} image The giveaway embed image
         */
        this.messages = options.messages || {};
        /**
         * The message of the giveaway
         * @type {import('discord.js').Message}
         */
        this.message = null;
    }

    get messageURL() {
        return `https://discord.com/channels/${this.guildId}/${this.channelId}/${this.messageId}`;
    }

    get data() {
        return {
            id: this.id,
            hoster: this.hoster,
            prize: this.prize,
            startAt: this.startAt,
            endsAt: this.endsAt,
            ended: this.ended,
            channelId: this.channelId,
            guildId: this.guildId,
            messageId: this.messageId,
            winnerCount: this.winnerCount,
            winners: this.winners,
            entered: this.entered,
            extraData: this.extraData,
            messages: this.messages,
            reaction: this.reaction
        }
    }

    setMessageId(messageId) {
        this.messageId = messageId;
    }

    async end() {
        return new Promise(async (resolve, reject) => {
            if (this.ended) return;
            this.ended = true;
            this.message = await this.fetchMessage().catch((err) => {
                if (err.includes('Try later!')) this.ended = false;
                return reject(err);
            });
            if (!this.message) return;
            const channel = this.message.channel.isThread() && !this.message.channel.sendable ? this.message.channel.parent : this.message.channel;
            if (this.entered.length === 0) {
                const reactions = await this.message?.reactions?.cache?.get(this.reaction)?.users?.fetch();
                reactions?.forEach((user) => {
                    if (user.bot) return;
                    this.entered.push(user.id);
                    this.entered = this.entered.filter((u) => u !== this.client.user.id);
                });
            }
            await this.roll(this.entered);
            await this.manager.editData(this.data);
            this.message?.edit({
                embeds: [(await this.manager.endEmbed(this.data))],
                content: `${this.client.config.Client.emoji.gift} **GIVEAWAY ENDED** ${this.client.config.Client.emoji.gift}`,
            })
            channel?.send({
                content: this.winners.length ? `Congratulations ${this.winners.map((w) => `<@${w}>`).join(', ')}! You won **${this.prize}**!` : 'No one won the giveaway!',
                allowedMentions: {
                    parse: ['users']
                },
                reply: {
                    messageReference: this.messageId,
                    failIfNotExists: false
                }
            }).catch(() => { });
            resolve();
        })
    }

    /**
     * Edits the giveaway.
     * @param {object} options The edit options.
     * @param {string} [options.prize] The new prize of the giveaway.
     * @param {number} [options.winnerCount] The new winner count of the giveaway.
     * @param {string} [options.hoster] The new host of the giveaway.
     * @param {number} [options.duration] The new duration of the giveaway.
     * @param {object} [options.extraData] The new extra data of the giveaway.
     * @param {object} [options.messages] The new messages of the giveaway.
     * @param {string} [options.messages.embedColor] The new embed color of the giveaway.
     * @param {string} [options.messages.description] The new embed description of the giveaway.
     * @param {string} [options.messages.title] The new embed title of the giveaway.
     * @param {string} [options.messages.url] The new embed url of the giveaway.
     * @param {string} [options.messages.image] The new embed image of the giveaway.
     * @param {string} [options.reaction] The new reaction of the giveaway.
     * @returns {Promise<Giveaway>} The edited giveaway.
     */
    async edit(options = {}) {
        return new Promise(async (resolve, reject) => {
            if (this.ended) return reject('The giveaway is ended!');
            this.message ??= await this.fetchMessage().catch(() => { });
            if (!this.message) return reject('The giveaway message is not found!');
            if (typeof options.prize === 'string') this.prize = options.prize;
            if (typeof options.messages.image === 'string') this.messages.image = options.messages.image;
            if (options.extraData) this.extraData = options.extraData;
            if (Number.isInteger(options.winnerCount)) this.winnerCount = options.winnerCount;
            if (Number.isFinite(options.duration)) this.endsAt = this.endsAt + options.duration;
            this.manager.editData(this.data);
            let embed = await this.manager.mainEmbed(this.data);
            let button = await this.manager.embedButton(this.data);
            this.message?.edit({
                embeds: [embed],
                components: [this.client.util.row().addComponents(button)]
            }).catch(() => { });
            resolve(this);
        })
    }

    /**
     * Edits the giveaway.
     * @param {object} options The edit options.
     * @param {number} [options.winnerCount] The new winner count of the giveaway.
     * @returns {Promise<Giveaway>} The edited giveaway.
     */
    async reroll(options = {}) {
        return new Promise(async (resolve, reject) => {
            // if (this.ended) return reject('The giveaway is ended!');
            this.message ??= await this.fetchMessage().catch(() => { });
            if (!this.message) return reject('The giveaway message is not found!');
            if (options.winnerCount && (!Number.isInteger(options.winnerCount) || options.winnerCount < 1)) {
                return reject(`options.winnerCount is not a positive integer. (val=${options.winnerCount})`);
            }
            if (options.winnerCount) this.winnerCount = options.winnerCount;
            const channel = this.message.channel.isThread() && !this.message.channel.sendable ? this.message.channel.parent : this.message.channel;
            if (!this.entered) {
                const reactions = await this.message?.reactions?.cache?.get(this.reaction)?.users?.fetch();
                reactions?.forEach((user) => {
                    if (user.bot) return;
                    this.entered.push(user.id);
                    this.entered = this.entered.filter((u) => u !== this.client.user.id);
                });
            }
            this.entered.map((user) => {
                if (this.winners.includes(user)) {
                    this.entered.splice(this.entered.indexOf(user), 1);
                }
            });
            await this.roll(this.entered);
            await this.manager.editData(this.data);
            let embed = await this.manager.mainEmbed(this.data);
            this.message?.edit({
                embeds: [embed]
            })
            channel?.send({
                content: this.winners.length ? ` New winner(s): ${this.winners.map((w) => `<@${w}>`).join(', ')}! Congratulations, You won **${this.prize}**!` : 'No one won the giveaway!',
                allowedMentions: {
                    parse: ['users']
                },
                reply: {
                    messageReference: this.messageId,
                    failIfNotExists: false
                }
            }).catch(() => { });
            resolve(this);
        })
    }

    async roll(winners, winnerCount = this.winnerCount) {
        if (!winners.length) return [];
        let randomUser = this.client.util.getRandom(winners, winnerCount);
        if (!randomUser) return [];
        this.winners = randomUser;
        return this.winners || [];
    }

    /**
     * Fetches the giveaway message from its channel.
     * @returns {Promise<import('discord.js').Message>} The Discord message
     */
    async fetchMessage() {
        return new Promise(async (resolve, reject) => {
            let tryLater = true;
            const channel = await this.client?.channels.fetch(this.channelId).catch((err) => {
                if (err.code === 10003) tryLater = false;
            });
            const message = await channel?.messages.fetch(this.messageId).catch((err) => {
                if (err.code === 10008) tryLater = false;
            });
            if (!message) {
                if (!tryLater) {
                    this.manager.giveaways = this.manager.giveaways.filter((g) => g.messageId !== this.messageId);
                    await this.manager.deleteData(this.data);
                }
                return reject(
                    'Unable to fetch message with Id ' + this.messageId + '.' + (tryLater ? ' Try later!' : '')
                );
            }
            resolve(message);
        });
    }
}