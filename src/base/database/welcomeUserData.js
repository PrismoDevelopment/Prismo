const mongoData = require("../../models/welcomeDataUser");
module.exports = class welcomeUserData {
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
            value.id = await this.makeid(8);
            data.message.push(value);
            await data.save();
            return data;
        }
    }
    async postAll(id, value) {
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
    async getAll() {
        let data = await mongoData.find();
        if (data) return data;
    }
    async put(id, fieldId, value) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
        }
        if (data) {
            const index = data.message.findIndex((x) => x.id == fieldId);
            value.id = fieldId;
            data.message[index] = value;
            await data.save();
            return data;
        }
    }
    async delete(id, fieldId) {
        let data = await mongoData.findOne({ id: id });
        if (!data) {
            data = new mongoData({ id: id });
            await data.save();
        }
        if (data) {
            data.message = data.message.filter((x) => x.id !== fieldId);
            await data.save();
            return data;
        }
    }

    makeid(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }
};
