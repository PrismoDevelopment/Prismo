const { Schema, model } = require("mongoose");

const noprefixUserData = new Schema({
    id: { type: Object, required: true },
    userids: { type: Array, default: [] },
});

module.exports = model("noprefixUserData", noprefixUserData);
