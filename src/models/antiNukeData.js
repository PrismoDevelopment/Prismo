const { model, Schema } = require("mongoose");

const antiNukeData = new Schema({
    id: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: false },
    punishment: { type: String, required: true, default: "ban" },
    whitelistusers: { type: Array, required: true, default: [] },
    logchannelid: { type: String, required: false, default: null },
    antivanity: { type: Boolean, required: true, default: false },
    prismorole: { type: String, required: false, default: null },
});

module.exports = model("antiNukeData", antiNukeData);