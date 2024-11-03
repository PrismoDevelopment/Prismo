const mongoData = require("../../models/afkData");
module.exports = class afkData {
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
            return null;
        }
        if (data) return data;
    }
    async putAfk(id, reason) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id, reason: reason, time: Date.now() });
            await data.save();
            await this.database.client.cache.set(id, data);
        }
        data.reason = reason;
        data.time = Date.now();
        await data.save();
        await this.database.client.cache.set(id, data);
        return data;
    }
    async deleteAfk(id) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            return true;
        }
            await data.deleteOne( { id: id } );
            await this.database.client.cacheAfkData();
            await this.database.client.cache.delete(id);
            return true;
    }

    async find() {
        let data = await mongoData.find();
        if (data) return data;
    }
};