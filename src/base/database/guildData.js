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
            await this.database.client.cache.set(id+"1", data);
        }
        if (data) {
            data = value;
            await data.save();
            await this.database.client.cache.set(id+"1", data);
        }
    }

    async putAutorole(id, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
            await this.database.client.cache.set(id+"1", data);
        }
        if (data) {
            data.autorole = value;
            await data.save();
            await this.database.client.cache.set(id+"1", data);
            return data;
        }
    }

    async putVcrole(id, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
            await this.database.client.cache.set(id+"1", data);
        }
        if (data) {
            data.vcrole = value;
            await data.save();
            await this.database.client.cache.set(id+"1", data);
            return data;
        }
    }
    async putGreet(id, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
            await this.database.client.cache.set(id+"1", data);
        }
        if (data) {
            data.greet = value;
            await data.save();
            await this.database.client.cache.set(id+"1", data);
            return data;
        }
    }
    async putWelcome(id, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
            await this.database.client.cache.set(id+"1", data);
        }
        if (data) {
            data.welcome = value;
            await data.save();
            await this.database.client.cache.set(id+"1", data);
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
    async presenserole(id, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
            await this.database.client.cache.set(id+"1", data);
        }
        if (data) {
            data.presenserole = value;
            await data.save();
            await this.database.client.cache.set(id+"1", data);
            return data;
        }
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
            this.database.client.cache.set(id, data);
            this.database.client.cache.set(id+"1", data);
            return data;
        }
    }
    async find() {
        let data = await mongoData.find();
        if (data) return data;
    }
};
