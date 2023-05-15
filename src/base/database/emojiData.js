const mongoData = require("../../models/emojiData");
module.exports = class emojiData {
    /**
     *
     * @param {import('../database')} database
     */
    constructor(database) {
        this.database = database;
    }
    async get(id) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
        }
        if (data) return data;
    }
    async putEmoji(id, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
        }
        if (data) {
            data = value;
            await data.save();
            return data;
        }
    }
};
