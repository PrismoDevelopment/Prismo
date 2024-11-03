const { model, Schema } = require("mongoose");

const data = new Schema({
    id: { type: String, required: true },
    managerRoles: { type: Array, default: [] },
    blackListedUsers: { type: Array, default: [] },
    winRoles: { type: Array, default: [] }
});

module.exports = model("guildGiveawayData", data);