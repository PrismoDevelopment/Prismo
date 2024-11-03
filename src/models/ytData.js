const { Schema, model } = require("mongoose");

const ytData = new Schema({
    id: { type: String, required: true },
    ytchannel: { type: String, default: null },
    channel: { type: String, default: null },
    ping: { type: Boolean, default: false },
    postedvids: { type: Array, default: [] },

});

module.exports = model("ytData", ytData);