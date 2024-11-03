const mongoData = require("../../models/antiNukeData");
const { cacheData } = require("../PrismoClient");
module.exports = class antiNukeData {
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
            this.database.client.cache.set(id, data);
            return data
        }
        if (data) {
            this.database.client.cache.set(id, data);
            return data
        }
    }

    async post(id, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
            await this.database.client.cache.set(id, data);
            return data
        }
        if (data) {
            data = value;
            await data.save();
            await this.database.client.cache.set(id, data);
            return data
        }
    }
    async find() {
        let data = await mongoData.find();
        if (data) return data;
    }

}