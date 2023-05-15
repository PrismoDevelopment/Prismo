const mongoData = require("../../models/guildData");
module.exports = class guildData {
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
    async putPrefix(id, value) {
        let data = await mongoData.findOne;
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
        }
        if (data) {
            data = value;
            await data.save();
        }
    }

    async putAutorole(id, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
        }
        if (data) {
            data.autorole = value;
            await data.save();
            return data;
        }
    }
    async putGreet(id, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
        }
        if (data) {
            data.greet = value;
            await data.save();
            return data;
        }
    }
    async putWelcome(id, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
        }
        if (data) {
            data.welcome = value;
            await data.save();
            return data;
        }
    }
    async getWelcome(id) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
        }
        if (data) return data.welcome;
    }
    async set(id, value) {
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
