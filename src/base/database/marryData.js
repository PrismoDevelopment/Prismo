const mongoData = require("../../models/marryData");
module.exports = class marryData {
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
    async post(id, value) {
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
