const mongoData = require("../../models/stickynickData");
module.exports = class stickynickData {
    /**
     *
     * @param {import('../database')} database
     */
    constructor(database) {
        this.database = database;
    }
    async get(userId, guildId) {
        let data = await mongoData.findOne({
            userId: userId,
            guildId: guildId,
        });
        if (!data) {
            return false;
        }
        if (data) return data;
    }
    async set(user, guild, nick) {
        let data = await mongoData.findOne({ userId: user, guildId: guild });
        if (data) {
            return "exists";
        }
        if (!data) {
            data = new mongoData({ userId: user, guildId: guild, nick: nick });
            await data.save();
            return data;
        }
    }
    async remove(user, guild) {
        let data = await mongoData.findOne({ userId: user, guildId: guild });
        if (data) {
            await mongoData.deleteOne({ userId: user, guildId: guild });
            return true;
        }
        if (!data) {
            return false;
        }
    }
};
