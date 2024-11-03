const mongoData = require("../../models/StatusData");
module.exports = class StatusData {
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
            await this.database.client.cache.set(id+"status", data);
            await data.save();
        }
        if (data) {
            data = value;
            await data.save().catch(() => { });
            await this.database.client.cache.set(id+"status", data);
            return data;
        }
    }

    async find() {
        let data = await mongoData.find();
        if (data) return data;
    }
}